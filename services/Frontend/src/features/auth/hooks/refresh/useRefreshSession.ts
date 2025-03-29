import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authentication/authenticationService";
import { useAuthSession } from "@/features/auth/hooks";

export const useRefreshSession = () => {
    const storeSession = useAuthSession((state) => state.storeSession);

    return useMutation({
        mutationFn: AuthenticationService.refreshSession,
        onSuccess: ({ accessToken, account, accessScopes }) =>
            storeSession({
                identity: account,
                accessToken,
                scopes: accessScopes,
            }),
    });
};
