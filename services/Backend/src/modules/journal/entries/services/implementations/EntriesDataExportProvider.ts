import { Inject, Injectable } from "@nestjs/common";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { type IDataExportProvider } from "@/common/export/services/IDataExportProvider";
import { DataExportBatch } from "@/common/export/types/DataExportBatch";
import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { Order } from "@/common/pagination/types/Order";
import { type IEntryService, EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntryService";

@Injectable()
export class EntriesDataExportProvider implements IDataExportProvider {
    constructor(@Inject(EntryServiceToken) private readonly entryService: IEntryService) {}

    public supports(scope: DataExportScope): boolean {
        return scope.domain === DataExportScopeDomain.ENTRIES;
    }

    public async *getDataStream(tenantId: string, scope: DataExportScope): AsyncIterable<DataExportBatch> {
        const take = 1000;
        let nextCursor: string | null = null;
        let hasMore = true;

        const filters = {
            updatedAfter: scope.dateRange.from,
            updatedBefore: scope.dateRange.to,
        };

        let from = scope.dateRange.from;
        let to = scope.dateRange.to;

        while (hasMore) {
            const entries = await this.entryService.findAllDetailed(tenantId, { cursor: nextCursor, take, order: Order.ASC }, filters);
            const lastEntry = entries.data[entries.data.length - 1];

            nextCursor = entries.meta.nextCursor;
            hasMore = entries.meta.hasNextPage;
            to = hasMore ? lastEntry.createdAt : scope.dateRange.to;

            yield {
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
