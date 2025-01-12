import { useCallback } from "react";
import { QueryKey, useQueryClient } from "@tanstack/react-query";

export const useQueryCache = () => {
    const queryClient = useQueryClient();

    const update = useCallback(
        async <T>(queryKey: QueryKey, updateFn: (previousValue: T) => T | undefined) => {
            await queryClient.cancelQueries({ queryKey });
            const previousItems = queryClient.getQueryData(queryKey);

            if (updateFn) {
                queryClient.setQueryData(queryKey, updateFn);
            }

            return { previousItems };
        },
        [queryClient]
    );

    const revert = useCallback(
        (queryKey: QueryKey, context?: unknown) => {
            if (!context) {
                return;
            }

            const items = (context as { previousItems?: unknown }).previousItems;

            if (!items) {
                return;
            }

            queryClient.setQueryData(queryKey, items);
        },
        [queryClient]
    );

    const invalidate = useCallback(
        async (queryKey: QueryKey) => {
            await queryClient.invalidateQueries({ queryKey });
        },
        [queryClient]
    );

    return { update, revert, invalidate };
};
