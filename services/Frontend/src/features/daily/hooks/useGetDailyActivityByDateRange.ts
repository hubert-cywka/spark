import { useQuery } from "@tanstack/react-query";

import { DailyActivityService } from "@/features/daily/api/dailyActivityService.ts";
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
            queryFn: async () => await DailyActivityService.getActivity(from, to),
            staleTime: 0, // TODO: Can this be optimized?
        }),
        queryKey,
    };
};
