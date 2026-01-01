import { Inject, Injectable } from "@nestjs/common";
import dayjs from "dayjs";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { type IDataExportProvider } from "@/common/export/services/IDataExportProvider";
import { DataExportBatch } from "@/common/export/types/DataExportBatch";
import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { Order } from "@/common/pagination/types/Order";
import { formatToISODateString } from "@/common/utils/dateUtils";
import { type IEntryService, EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntryService";

@Injectable()
export class EntriesDataExportProvider implements IDataExportProvider {
    constructor(@Inject(EntryServiceToken) private readonly entryService: IEntryService) {}

    public supports(scope: DataExportScope): boolean {
        return scope.domain === DataExportScopeDomain.ENTRIES;
    }

    public async *getDataStream(tenantId: string, scope: DataExportScope): AsyncIterable<DataExportBatch> {
        const globalEnd = dayjs(scope.dateRange.to);
        const globalStart = dayjs(scope.dateRange.from);
        let currentPeriodStart = globalStart;

        while (!globalEnd.isAfter(currentPeriodStart)) {
            const currentYearEnd = currentPeriodStart.endOf("year");
            const effectiveFrom = globalStart.isAfter(currentPeriodStart) ? globalStart : currentPeriodStart;
            const effectiveTo = globalEnd.isBefore(currentYearEnd) ? globalEnd : currentYearEnd;

            const batchScope: DataExportScope = {
                domain: scope.domain,
                dateRange: {
                    from: formatToISODateString(effectiveFrom.toDate()),
                    to: formatToISODateString(effectiveTo.toDate()),
                },
            };

            yield* this.getBatchStream(tenantId, batchScope);
            currentPeriodStart = currentYearEnd.add(1, "day").startOf("year");
        }
    }

    private async *getBatchStream(tenantId: string, batchScope: DataExportScope): AsyncIterable<DataExportBatch> {
        const take = 1000;
        let page = 1;

        let nextCursor: string | null = null;
        let hasMore = true;

        while (hasMore) {
            const entries = await this.entryService.findAll(
                tenantId,
                { cursor: nextCursor, take, order: Order.ASC },
                { from: batchScope.dateRange.from, to: batchScope.dateRange.to }
            );

            hasMore = entries.meta.hasNextPage;
            nextCursor = entries.meta.nextCursor;

            // Yield even if there is no data. TODO: Optimize later.
            yield {
                batch: entries.data,
                batchScope,
                page,
                hasMore,
            };

            page++;
        }
    }
}
