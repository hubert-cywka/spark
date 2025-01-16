import { InfiniteData, QueryKey, useMutation } from "@tanstack/react-query";

import { PageDto } from "@/api/dto/PageDto";
import { EntriesService } from "@/features/entries/api/entriesService";
import { Entry } from "@/features/entries/types/Entry";
import { useQueryCache } from "@/hooks/useQueryCache";

type UseUpdateEntryStatusOptions = {
    queryKey?: QueryKey;
};

export const useUpdateEntryStatus = ({ queryKey }: UseUpdateEntryStatusOptions) => {
    const { revert, update } = useQueryCache();

    return useMutation({
        mutationFn: EntriesService.updateStatus,
        onMutate: async ({ entryId, isCompleted }) => {
            if (!queryKey) {
                return;
            }

            return await update<InfiniteData<PageDto<Entry>>>(queryKey, ({ pages, pageParams }) => {
                const newPages =
                    pages.map((page) => {
                        return {
                            ...page,
                            data: page.data.map((entry) => (entry.id === entryId ? { ...entry, isCompleted } : entry)),
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
