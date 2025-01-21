import { InfiniteData, useMutation } from "@tanstack/react-query";

import { PageDto } from "@/api/dto/PageDto";
import { EntriesService } from "@/features/entries/api/entriesService";
import { Entry } from "@/features/entries/types/Entry";
import { EntriesQueryKeyFactory } from "@/features/entries/utils/entriesQueryKeyFactory";
import { useQueryCache } from "@/hooks/useQueryCache";

const queryKey = EntriesQueryKeyFactory.createForAll();

export const useCreateEntry = () => {
    const { update } = useQueryCache();

    return useMutation({
        mutationFn: EntriesService.createOne,
        onSuccess: async (createdEntry) => {
            return await update<InfiniteData<PageDto<Entry>>>(queryKey, ({ pages, pageParams }) => {
                const lastPage = pages[pages.length - 1];
                const newFirstPage = {
                    ...lastPage,
                    data: [...lastPage.data, createdEntry],
                };
                return {
                    pageParams,
                    pages: [newFirstPage, ...pages.slice(1)],
                };
            });
        },
    });
};
