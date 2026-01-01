import { Inject, Injectable } from "@nestjs/common";

import { type IEventPublisher, DataExportBatchReadyEvent, EventPublisherToken } from "@/common/events";
import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { DataExportAttachmentPathBuilder } from "@/common/export/services/DataExportAttachmentPathBuilder";
import { type IDataExporter } from "@/common/export/services/IDataExporter";
import { type IDataExportProvider, DataExportProvidersToken } from "@/common/export/services/IDataExportProvider";
import { DataExportBatch } from "@/common/export/types/DataExportBatch";
import { ExportAttachmentStage } from "@/common/export/types/ExportAttachmentStage";
import { type IObjectStorage, ObjectStorageToken } from "@/common/objectStorage/services/IObjectStorage";
import { type ICsvParser, CsvParserToken } from "@/common/services/interfaces/ICsvParser";

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

    async exportTenantData(tenantId: string, exportId: string, scopes: DataExportScope[]): Promise<void> {
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
        for await (const { batch, batchScope, page, hasMore } of data) {
            const fileContent = this.parser.toBuffer(batch);
            const filePath = this.buildAttachmentPath(exportId, batchScope, page);

            const { checksum } = await this.objectStorage.upload(filePath, fileContent, "text/csv");

            const manifest = {
                key: this.buildAttachmentKey(exportId, batchScope, page),
                path: filePath,
                scopes: [batchScope],
                stage: ExportAttachmentStage.PARTIAL,
                metadata: {
                    checksum,
                    part: page,
                    nextPart: hasMore ? page + 1 : null,
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
                        part: manifest.metadata.part,
                        checksum: manifest.metadata.checksum,
                        nextPart: manifest.metadata.nextPart,
                    },
                },
            })
        );
    }

    private buildAttachmentKey(exportId: string, scope: DataExportScope, page: number) {
        return `${exportId}__${scope.domain}__${scope.dateRange.from}_${scope.dateRange.to}__page-${page}`;
    }

    private buildAttachmentPath(exportId: string, scope: DataExportScope, page: number) {
        return DataExportAttachmentPathBuilder.forExport(exportId).setScope(scope).setFilename(`page-${page}.csv`).build();
    }
}
