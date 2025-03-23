import { useQuery } from "@tanstack/react-query";

import { DailyInsightsService } from "@/features/daily/api/dailyInsightsService.ts";
import { DailyActivityQueryKeyFactory } from "@/features/daily/utils/dailyActivityQueryKeyFactory.ts";

type UseGetDailyActivityByDateRangeOptions = {
    from: string;
    to: string;
};

export const useGetDailyActivityByDateRange = ({ from, to }: UseGetDailyActivityByDateRangeOptions) => {
    const queryKey = DailyActivityQueryKeyFactory.createForDateRange(from, to);

    return {
        ...useQuery({
            queryKey,
            queryFn: async () => {
                const result = await DailyInsightsService.getInsights(from, to);
                return result.activityHistory;
            },
            staleTime: 0, // TODO: Can this be optimized?
        }),
        queryKey,
    };
};
