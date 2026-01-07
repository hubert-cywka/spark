import { Inject, Injectable } from "@nestjs/common";

import { type IEventPublisher, DataExportBatchReadyEvent, EventPublisherToken } from "@/common/events";
import { type IObjectStorage, ObjectStorageToken } from "@/common/objectStorage/services/IObjectStorage";
import { type ICsvParser, CsvParserToken } from "@/common/services/interfaces/ICsvParser";
import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";
import { ExportAttachmentManifest } from "@/modules/exports/shared/models/ExportAttachment.model";
import { DataExportAttachmentPathBuilder } from "@/modules/exports/shared/services/DataExportAttachmentPathBuilder";
import { type IDataExporter } from "@/modules/exports/shared/services/IDataExporter";
import { type IDataExportProvider, DataExportProvidersToken } from "@/modules/exports/shared/services/IDataExportProvider";
import { DataExportBatch } from "@/modules/exports/shared/types/DataExportBatch";
import { ExportAttachmentStage } from "@/modules/exports/shared/types/ExportAttachmentStage";

@Injectable()
export class DataExporter implements IDataExporter {
    constructor(
        @Inject(DataExportProvidersToken)
        private readonly providers: IDataExportProvider[],
        @Inject(EventPublisherToken)
        private readonly publisher: IEventPublisher,
        @Inject(CsvParserToken)
        private readonly parser: ICsvParser,
        @Inject(ObjectStorageToken)
        private readonly objectStorage: IObjectStorage
    ) {}

    // TODO: Idempotency - start from the last checkpoint
    public async exportTenantData(tenantId: string, exportId: string, scopes: DataExportScope[]): Promise<void> {
        for (const scope of scopes) {
            const provider = this.providers.find((p) => p.supports(scope));

            if (!provider) {
                continue;
            }

            const dataStream = provider.getDataStream(tenantId, scope);
            await this.processExport(tenantId, exportId, dataStream);
        }
    }

    private async processExport(tenantId: string, exportId: string, data: AsyncIterable<DataExportBatch>) {
        for await (const { batch, batchScope } of data) {
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

            await this.publishDataExportBatchReadyEvent(tenantId, exportId, manifest);
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
}
