import { Inject, Injectable } from "@nestjs/common";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { type IDataExportProvider } from "@/common/export/services/IDataExportProvider";
import { DataExportBatch } from "@/common/export/types/DataExportBatch";
import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { Order } from "@/common/pagination/types/Order";
import { type IGoalService, GoalServiceToken } from "@/modules/journal/goals/services/interfaces/IGoalService";

@Injectable()
export class GoalsDataExportProvider implements IDataExportProvider {
    constructor(@Inject(GoalServiceToken) private readonly goalService: IGoalService) {}

    public supports(scope: DataExportScope): boolean {
        return scope.domain === DataExportScopeDomain.GOALS;
    }

    public async *getDataStream(tenantId: string, scope: DataExportScope): AsyncIterable<DataExportBatch> {
        const take = 1000;
        let page = 1;

        let nextCursor: string | null = null;
        let hasMore = true;

        while (hasMore) {
            const goals = await this.goalService.findAll(
                tenantId,
                { cursor: nextCursor, take, order: Order.ASC },
                { from: scope.dateRange.from, to: scope.dateRange.to, withProgress: true }
            );

            hasMore = goals.meta.hasNextPage;
            nextCursor = goals.meta.nextCursor;

            yield {
                batch: goals.data,
                batchScope: scope,
                page,
                hasMore,
            };

            page++;
        }
    }
}
