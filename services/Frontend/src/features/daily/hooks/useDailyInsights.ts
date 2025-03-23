import { useQuery } from "@tanstack/react-query";

import { DailyInsightsService } from "@/features/daily/api/dailyInsightsService.ts";
import { DailyInsightsQueryKeyFactory } from "@/features/daily/utils/dailyInsightsQueryKeyFactory.ts";

type UseDailyInsightsOptions = {
    from: string;
    to: string;
};

export const useDailyInsights = ({ from, to }: UseDailyInsightsOptions) => {
    const queryKey = DailyInsightsQueryKeyFactory.createForDateRange(from, to);

    return {
        ...useQuery({
            queryKey,
            queryFn: async () => await DailyInsightsService.getInsights(from, to),
            staleTime: 0, // TODO: Can this be optimized?
        }),
        queryKey,
    };
};
