import { Inject, Injectable } from "@nestjs/common";

import { type IEventPublisher, DataExportBatchReadyEvent, EventPublisherToken } from "@/common/events";
import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { type IDataExporter } from "@/common/export/services/IDataExporter";
import { type IDataExportProvider, DataExportProvidersToken } from "@/common/export/services/IDataExportProvider";
import { DataExportBatch } from "@/common/export/types/DataExportBatch";
import { type IObjectStorage, ObjectStorageToken } from "@/common/s3/services/IObjectStorage";
import { type IChecksumCalculator, ChecksumCalculatorToken } from "@/common/services/interfaces/IChecksumCalculator";
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
        @Inject(ChecksumCalculatorToken)
        private readonly checksumCalculator: IChecksumCalculator,
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
            const fileChecksum = await this.checksumCalculator.fromBuffer(fileContent);

            const manifest = {
                scope: batchScope,
                key: this.buildAttachmentKey(exportId, batchScope, page),
                path: this.buildAttachmentPath(exportId, batchScope, page),
                metadata: {
                    checksum: fileChecksum,
                    part: page,
                    nextPart: hasMore ? page + 1 : null,
                },
            };

            await this.objectStorage.upload(manifest.path, fileContent);
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
                    scope: manifest.scope,
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
        return `export/${exportId}/${scope.domain}/${scope.dateRange.from}_${scope.dateRange.to}/page-${page}.csv`;
    }
}
