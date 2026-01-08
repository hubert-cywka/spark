import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { runInTransaction } from "typeorm-transactional";

import { type IEventPublisher, DataExportBatchReadyEvent } from "@/common/events";
import { type IObjectStorage } from "@/common/objectStorage/services/IObjectStorage";
import { type ICsvParser } from "@/common/services/interfaces/ICsvParser";
import { ExportStatusEntity } from "@/modules/exports/shared/entities/ExportStatus.entity";
import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";
import { ExportAttachmentManifest } from "@/modules/exports/shared/models/ExportAttachment.model";
import { DataExportAttachmentPathBuilder } from "@/modules/exports/shared/services/DataExportAttachmentPathBuilder";
import { type IDataExporter } from "@/modules/exports/shared/services/IDataExporter";
import { type IDataExportProvider } from "@/modules/exports/shared/services/IDataExportProvider";
import { DataExportBatch } from "@/modules/exports/shared/types/DataExportBatch";
import { DataExportScopeDomain } from "@/modules/exports/shared/types/DataExportScopeDomain";
import { ExportAttachmentStage } from "@/modules/exports/shared/types/ExportAttachmentStage";

@Injectable()
export class DataExporter implements IDataExporter {
    constructor(
        private readonly providers: IDataExportProvider[],
        private readonly publisher: IEventPublisher,
        private readonly parser: ICsvParser,
        private readonly objectStorage: IObjectStorage,
        private readonly repository: Repository<ExportStatusEntity>,
        private readonly connectionName: string
    ) {}

    public async exportTenantData(tenantId: string, exportId: string, scopes: DataExportScope[]): Promise<void> {
        for (const scope of scopes) {
            const provider = this.providers.find((p) => p.supports(scope));

            if (!provider) {
                continue;
            }

            const status = await this.getStatus(exportId, scope.domain);

            if (status?.exportedUntil && status.exportedUntil >= scope.dateRange.to) {
                continue;
            }

            const dataStream = provider.getDataStream(tenantId, scope, status);
            await this.processExport(tenantId, exportId, dataStream);
        }
    }

    private async processExport(tenantId: string, exportId: string, data: AsyncIterable<DataExportBatch>) {
        for await (const { batch, batchScope, nextCursor } of data) {
            const fileContent = this.parser.toBuffer(batch);
            const filePath = this.buildAttachmentPath(exportId, batchScope);

            const { checksum } = await this.objectStorage.upload(filePath, fileContent, "text/csv");
            const manifest = {
                key: this.buildAttachmentKey(exportId, batchScope),
                path: filePath,
                scopes: [batchScope],
                stage: ExportAttachmentStage.TEMPORARY,
                metadata: {
                    checksum,
                },
            };

            await runInTransaction(
                async () => {
                    await this.publishDataExportBatchReadyEvent(tenantId, exportId, manifest);
                    await this.checkpoint(exportId, batchScope, nextCursor);
                },
                { connectionName: this.connectionName }
            );
        }
    }

    private async publishDataExportBatchReadyEvent(tenantId: string, exportId: string, manifest: ExportAttachmentManifest): Promise<void> {
        await this.publisher.enqueue(
            new DataExportBatchReadyEvent(tenantId, {
                tenant: { id: tenantId },
                export: { id: exportId },
                attachment: {
                    key: manifest.key,
                    path: manifest.path,
                    scopes: manifest.scopes,
                    stage: manifest.stage,
                    metadata: {
                        checksum: manifest.metadata.checksum,
                    },
                },
            })
        );
    }

    private buildAttachmentKey(exportId: string, scope: DataExportScope) {
        return `${exportId}__${scope.domain}__${scope.dateRange.from.toISOString()}_${scope.dateRange.to.toISOString()}`;
    }

    private buildAttachmentPath(exportId: string, scope: DataExportScope) {
        return DataExportAttachmentPathBuilder.forExport(exportId).setScope(scope).setFilename("data.csv").build();
    }

    private async getStatus(exportId: string, domain: DataExportScopeDomain) {
        return await this.getRepository().findOne({ where: { exportId, domain } });
    }

    private async checkpoint(exportId: string, scope: DataExportScope, nextCursor: string | null) {
        const domain = scope.domain;
        const exportedUntil = scope.dateRange.to;

        await this.repository
            .createQueryBuilder()
            .insert()
            .values({ exportId, domain, exportedUntil, nextCursor })
            .orUpdate(["exportedUntil", "nextCursor"], ["exportId", "domain"])
            .execute();
    }

    private getRepository(): Repository<ExportStatusEntity> {
        return this.repository;
    }
}
