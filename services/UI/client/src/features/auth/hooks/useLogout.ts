import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { useAuthToken } from "@/features/auth/hooks/useAuthToken";
import { useUserStore } from "@/features/auth/hooks/useUserStore";

export const useLogout = () => {
    const removeUser = useUserStore((state) => state.removeUser);
    const { setToken } = useAuthToken();

    const onLogoutSuccess = useCallback(() => {
        removeUser();
        setToken(null);
    }, [setToken, removeUser]);

    return useMutation({
        mutationFn: AuthenticationService.logout,
        onSuccess: onLogoutSuccess,
    });
};
