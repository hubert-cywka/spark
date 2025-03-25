import { useQuery } from "@tanstack/react-query";

import { EntriesInsightsService } from "@/features/entries/api/entriesInsightsService";
import { EntriesInsightsQueryKeyFactory } from "@/features/entries/utils/entriesInsightsQueryKeyFactory";
import { ISODateString } from "@/types/ISODateString";

type UseEntryLoggingHistogramOptions = {
    from: ISODateString;
    to: ISODateString;
    enabled?: boolean;
};

export const useEntryLoggingHistogram = ({ from, to, enabled }: UseEntryLoggingHistogramOptions) => {
    const queryKey = EntriesInsightsQueryKeyFactory.createForLoggingHistogram(from, to);

    return {
        ...useQuery({
            queryKey,
            queryFn: async () => await EntriesInsightsService.getLoggingHistogram(from, to),
            staleTime: 0, // TODO: Can this be optimized?
        }),
        queryKey,
        enabled,
    };
};
