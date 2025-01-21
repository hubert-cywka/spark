import { InfiniteData, useMutation } from "@tanstack/react-query";

import { PageDto } from "@/api/dto/PageDto";
import { EntriesService } from "@/features/entries/api/entriesService";
import { Entry } from "@/features/entries/types/Entry";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = EntriesQueryKeyFactory.createForAll();

// TODO: Fix cache invalidation where applicable
export const useUpdateEntryContent = () => {
    const { revert, update } = useQueryCache();

    return useMutation({
        mutationFn: EntriesService.updateContent,
        onMutate: async ({ entryId, content }) => {
            return await update<InfiniteData<PageDto<Entry>>>(queryKey, ({ pages, pageParams }) => {
                const newPages =
                    pages.map((page) => {
                        return {
                            ...page,
                            data: page.data.map((entry) => (entry.id === entryId ? { ...entry, content } : entry)),
                        };
                    }) ?? [];
                return { pageParams, pages: newPages };
            });
        },
        onError: (_error, _variables, context) => {
            revert(context);
        },
    });
};
