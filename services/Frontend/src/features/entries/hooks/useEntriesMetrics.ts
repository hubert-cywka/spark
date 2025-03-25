import { useQuery } from "@tanstack/react-query";

import { EntriesInsightsService } from "@/features/entries/api/entriesInsightsService";
import { EntriesInsightsQueryKeyFactory } from "@/features/entries/utils/entriesInsightsQueryKeyFactory";
import { ISODateString } from "@/types/ISODateString";

type UseEntriesMetricsOptions = {
    from: ISODateString;
    to: ISODateString;
    enabled?: boolean;
};

export const useEntriesMetrics = ({ from, to, enabled }: UseEntriesMetricsOptions) => {
    const queryKey = EntriesInsightsQueryKeyFactory.createForMetrics(from, to);

    return {
        ...useQuery({
            queryKey,
            queryFn: async () => await EntriesInsightsService.getMetrics(from, to),
            staleTime: 0, // TODO: Can this be optimized?
        }),
        queryKey,
        enabled,
    };
};
