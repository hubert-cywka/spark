import { useEffect } from "react";

type UseAutoFetchOptions = {
    shouldFetch: boolean;
    fetch: () => void;
};

export const useAutoFetch = ({ shouldFetch, fetch }: UseAutoFetchOptions) => {
    useEffect(() => {
        if (shouldFetch) {
            void fetch();
        }
    }, [fetch, shouldFetch]);
};
