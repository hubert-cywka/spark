import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { useAuthSession } from "@/features/auth/hooks";

export const useRefreshSession = () => {
    const storeSession = useAuthSession((state) => state.storeSession);

    return useMutation({
        mutationFn: AuthenticationService.refreshSession,
        onSuccess: ({ accessToken, id, email }) => storeSession({ identity: { id, email }, accessToken }),
    });
};
