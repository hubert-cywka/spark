import { useInfiniteQuery } from "@tanstack/react-query";

import { DailyService } from "@/features/daily/api/dailyService";
import { DailyQueryKeyFactory } from "@/features/daily/utils/dailyQueryKeyFactory";
import { getNextPage, getPreviousPage } from "@/lib/queryClient/pagination";

const queryKey = DailyQueryKeyFactory.createForAll();

type UseDailiesOptions = {
    from: string;
    to: string;
};

export const useDailies = ({ from, to }: UseDailiesOptions) => {
    return useInfiniteQuery({
        queryKey,
        initialPageParam: 1,
        queryFn: async ({ pageParam }) => await DailyService.getPage(from, to, pageParam),
        getNextPageParam: getNextPage,
        getPreviousPageParam: getPreviousPage,
    });
};
