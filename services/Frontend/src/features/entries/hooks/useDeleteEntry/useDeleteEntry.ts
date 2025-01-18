import { InfiniteData, QueryKey, useMutation } from "@tanstack/react-query";

import { PageDto } from "@/api/dto/PageDto";
import { EntriesService } from "@/features/entries/api/entriesService";
import { Entry } from "@/features/entries/types/Entry";
import { useQueryCache } from "@/hooks/useQueryCache";

type UseDeleteEntryOptions = {
    queryKey?: QueryKey;
};

export const useDeleteEntry = ({ queryKey }: UseDeleteEntryOptions) => {
    const { revert, update } = useQueryCache();

    return useMutation({
        mutationFn: EntriesService.deleteOne,
        onMutate: async ({ entryId }) => {
            if (!queryKey) {
                return;
            }

            return await update<InfiniteData<PageDto<Entry>>>(queryKey, ({ pages, pageParams }) => {
                const newPages =
                    pages.map((page) => {
                        return {
                            ...page,
                            data: page.data.filter((entry) => entry.id !== entryId),
                        };
                    }) ?? [];
                return { pageParams, pages: newPages };
            });
        },
        onError: (_error, _variables, context) => {
            if (!queryKey) {
                return;
            }

            revert(queryKey, context);
        },
    });
};
