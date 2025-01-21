import { useCallback } from "react";
import { QueryKey, useQueryClient } from "@tanstack/react-query";

export const useQueryCache = () => {
    const queryClient = useQueryClient();

    const update = useCallback(
        async <T>(partialQueryKey: QueryKey, updateFn: (previousValue: T) => T | undefined) => {
            const matchingQueries = queryClient.getQueryCache().findAll({ queryKey: partialQueryKey });

            const updatedItems = matchingQueries.map((query) => {
                const queryKey = query.queryKey;
                queryClient.cancelQueries({ queryKey });

                const previousItems = queryClient.getQueryData<T>(queryKey);

                if (previousItems && updateFn) {
                    queryClient.setQueryData<T>(queryKey, updateFn(previousItems));
                }

                return { queryKey, data: previousItems };
            });

            return { previousItems: updatedItems };
        },
        [queryClient]
    );

    const revert = useCallback(
        (context?: { previousItems: { queryKey: QueryKey; data: unknown }[] }) => {
            if (!context || !context.previousItems) {
                return;
            }

            context.previousItems.forEach(({ queryKey, data }) => {
                queryClient.setQueryData(queryKey, data);
            });
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
