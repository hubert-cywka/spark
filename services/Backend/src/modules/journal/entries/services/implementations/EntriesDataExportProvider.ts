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
        let currentMonthStart = dayjs(scope.dateRange.from).startOf("month");
        const globalEnd = dayjs(scope.dateRange.to);

        while (currentMonthStart.isBefore(globalEnd) || currentMonthStart.isSame(globalEnd)) {
            const currentMonthEnd = currentMonthStart.endOf("month");

            const effectiveTo = globalEnd.isBefore(currentMonthEnd) ? globalEnd : currentMonthEnd;

            const batchScope: DataExportScope = {
                domain: scope.domain,
                dateRange: {
                    from: formatToISODateString(currentMonthStart.toDate()),
                    to: formatToISODateString(effectiveTo.toDate()),
                },
            };

            yield* this.getBatchStream(tenantId, batchScope);
            currentMonthStart = currentMonthStart.add(1, "month");
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

            // Yield even if there is no data. Optimize later.
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
