import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { useAuthSession } from "@/features/auth/hooks";

export const useLoginWithCredentials = () => {
    const storeSession = useAuthSession().storeSession;

    return useMutation({
        mutationFn: AuthenticationService.loginWithCredentials,
        onSuccess: ({ accessToken, id, email }) => storeSession({ identity: { id, email }, accessToken }),
    });
};
