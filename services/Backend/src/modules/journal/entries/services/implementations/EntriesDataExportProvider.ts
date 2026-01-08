import { Inject, Injectable } from "@nestjs/common";

import { Order } from "@/common/pagination/types/Order";
import { ExportStatus } from "@/modules/exports/shared/entities/ExportStatus.entity";
import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";
import { type IDataExportProvider } from "@/modules/exports/shared/services/IDataExportProvider";
import { DataExportBatch } from "@/modules/exports/shared/types/DataExportBatch";
import { DataExportScopeDomain } from "@/modules/exports/shared/types/DataExportScopeDomain";
import { type IEntryService, EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntryService";

@Injectable()
export class EntriesDataExportProvider implements IDataExportProvider {
    constructor(@Inject(EntryServiceToken) private readonly entryService: IEntryService) {}

    public supports(scope: DataExportScope): boolean {
        return scope.domain === DataExportScopeDomain.ENTRIES;
    }

    public async *getDataStream(
        tenantId: string,
        scope: DataExportScope,
        status: ExportStatus | null = null
    ): AsyncIterable<DataExportBatch> {
        const take = 1000;
        let nextCursor = status?.nextCursor;
        let hasMore = true;

        const filters = {
            updatedAfter: scope.dateRange.from,
            updatedBefore: scope.dateRange.to,
        };

        let from = status?.exportedUntil ?? scope.dateRange.from;
        let to = scope.dateRange.to;

        while (hasMore) {
            const entries = await this.entryService.findAllDetailed(tenantId, { cursor: nextCursor, take, order: Order.ASC }, filters);
            const lastEntry = entries.data[entries.data.length - 1];

            nextCursor = entries.meta.nextCursor;
            hasMore = entries.meta.hasNextPage;
            to = hasMore ? lastEntry.updatedAt : scope.dateRange.to;

            yield {
                nextCursor,
                batch: entries.data,
                batchScope: {
                    domain: scope.domain,
                    dateRange: {
                        from,
                        to,
                    },
                },
            };

            from = to;
        }
    }
}
