import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { useUserStore } from "@/features/auth/hooks/useUserStore";

export const useLogout = () => {
    const removeUser = useUserStore((state) => state.removeUser);

    const onLogoutSuccess = useCallback(() => {
        removeUser();
    }, [removeUser]);

    return useMutation({
        mutationFn: AuthenticationService.logout,
        onSuccess: onLogoutSuccess,
    });
};
