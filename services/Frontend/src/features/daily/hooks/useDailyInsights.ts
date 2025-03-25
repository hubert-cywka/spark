import { useQuery } from "@tanstack/react-query";

import { DailyInsightsService } from "@/features/daily/api/dailyInsightsService.ts";
import { DailyInsightsQueryKeyFactory } from "@/features/daily/utils/dailyInsightsQueryKeyFactory.ts";
import { ISODateString } from "@/types/ISODateString";

type UseDailyInsightsOptions = {
    from: ISODateString;
    to: ISODateString;
    enabled?: boolean;
};

export const useDailyInsights = ({ from, to, enabled }: UseDailyInsightsOptions) => {
    const queryKey = DailyInsightsQueryKeyFactory.createForDateRange(from, to);

    return {
        ...useQuery({
            queryKey,
            queryFn: async () => await DailyInsightsService.getInsights(from, to),
            staleTime: 0, // TODO: Can this be optimized?
        }),
        queryKey,
        enabled,
    };
};
