import { useMutation } from "@tanstack/react-query";

import { OpenIDConnectService } from "@/features/auth/api/oidc/openIDConnectService";
import { useAuthSession } from "@/features/auth/hooks";

export const useCreateAccountWithOIDC = () => {
    const storeSession = useAuthSession((state) => state.storeSession);

    return useMutation({
        mutationFn: OpenIDConnectService.register,
        onSuccess: ({ accessToken, account, accessScopes }) =>
            storeSession({
                identity: account,
                accessToken,
                scopes: accessScopes,
            }),
    });
};
