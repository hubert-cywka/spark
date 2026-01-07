import { Inject, Injectable } from "@nestjs/common";

import { Order } from "@/common/pagination/types/Order";
import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";
import { type IDataExportProvider } from "@/modules/exports/shared/services/IDataExportProvider";
import { DataExportBatch } from "@/modules/exports/shared/types/DataExportBatch";
import { DataExportScopeDomain } from "@/modules/exports/shared/types/DataExportScopeDomain";
import { type IGoalService, GoalServiceToken } from "@/modules/journal/goals/services/interfaces/IGoalService";

@Injectable()
export class GoalsDataExportProvider implements IDataExportProvider {
    constructor(@Inject(GoalServiceToken) private readonly goalService: IGoalService) {}

    public supports(scope: DataExportScope): boolean {
        return scope.domain === DataExportScopeDomain.GOALS;
    }

    public async *getDataStream(tenantId: string, scope: DataExportScope): AsyncIterable<DataExportBatch> {
        const take = 1000;
        let nextCursor: string | null = null;
        let hasMore = true;

        const filters = {
            updatedAfter: scope.dateRange.from,
            updatedBefore: scope.dateRange.to,
            withProgress: true,
        };

        let from = scope.dateRange.from;
        let to = scope.dateRange.to;

        while (hasMore) {
            const goals = await this.goalService.findAll(tenantId, { cursor: nextCursor, take, order: Order.ASC }, filters);
            const lastGoal = goals.data[goals.data.length - 1];
            nextCursor = goals.meta.nextCursor;
            hasMore = goals.meta.hasNextPage;
            to = hasMore ? lastGoal.createdAt : scope.dateRange.to;

            yield {
                batch: goals.data,
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
