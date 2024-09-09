import { useCallback } from "react";

import { useAuthToken } from "@/features/auth/hooks/useAuthToken";
import { useUserStore } from "@/features/auth/hooks/useUserStore";

type UseLogout = () => void;

export const useLogout = (): UseLogout => {
    const { setToken } = useAuthToken();
    const removeUser = useUserStore((state) => state.removeUser);

    return useCallback(() => {
        removeUser();
        setToken(null);
    }, [setToken, removeUser]);
};
