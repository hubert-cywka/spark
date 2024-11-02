import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { useAuthStore } from "@/features/auth/hooks";
import { AuthenticationResponse } from "@/features/auth/types/authentication";

export const useRefreshSession = () => {
    const storeAccessToken = useAuthStore().storeAccessToken;
    const storeIdentity = useAuthStore().storeIdentity;

    const setSession = useCallback(
        ({ id, email, accessToken }: AuthenticationResponse) => {
            storeIdentity({ id, email });
            storeAccessToken(accessToken);
        },
        [storeAccessToken, storeIdentity]
    );

    return useMutation({
        mutationFn: AuthenticationService.refreshSession,
        onSuccess: setSession,
    });
};
