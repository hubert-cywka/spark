import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { useAuthStore } from "@/features/auth/hooks";
import { AuthenticationResponse } from "@/features/auth/types/authentication";

export const useLoginWithCredentials = () => {
    // TODO: Extract session logic to separate hook as session will be restored in at least 3 scenarios
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
        mutationFn: AuthenticationService.loginWithCredentials,
        onSuccess: setSession,
    });
};
