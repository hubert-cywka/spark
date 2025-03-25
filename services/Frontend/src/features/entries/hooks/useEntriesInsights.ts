import { useQuery } from "@tanstack/react-query";

import { EntriesInsightsService } from "@/features/entries/api/entriesInsightsService";
import { EntriesInsightsQueryKeyFactory } from "@/features/entries/utils/entriesInsightsQueryKeyFactory";
import { ISODateString } from "@/types/ISODateString";

type UseEntriesInsightsOptions = {
    from: ISODateString;
    to: ISODateString;
    enabled?: boolean;
};

export const useEntriesInsights = ({ from, to, enabled }: UseEntriesInsightsOptions) => {
    const queryKey = EntriesInsightsQueryKeyFactory.createForDateRange(from, to);

    return {
        ...useQuery({
            queryKey,
            queryFn: async () => await EntriesInsightsService.getInsights(from, to),
            staleTime: 0, // TODO: Can this be optimized?
        }),
        queryKey,
        enabled,
    };
};
