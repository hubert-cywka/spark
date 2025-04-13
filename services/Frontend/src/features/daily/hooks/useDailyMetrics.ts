import { useQuery } from "@tanstack/react-query";

import { DailyInsightsService } from "@/features/daily/api/dailyInsightsService.ts";
import { DailyInsightsQueryKeyFactory } from "@/features/daily/utils/dailyInsightsQueryKeyFactory.ts";
import { ISODateString } from "@/types/ISODateString";

type UseDailyMetricsOptions = {
    from: ISODateString;
    to: ISODateString;
    enabled?: boolean;
};

export const useDailyMetrics = ({ from, to, enabled }: UseDailyMetricsOptions) => {
    const queryKey = DailyInsightsQueryKeyFactory.createForMetrics(from, to);

    return {
        ...useQuery({
            queryKey,
            queryFn: async () => await DailyInsightsService.getMetrics(from, to),
            staleTime: 0, // TODO: Can this be optimized?
        }),
        queryKey,
        enabled,
    };
};
