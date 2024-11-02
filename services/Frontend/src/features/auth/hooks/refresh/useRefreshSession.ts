import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";

export const useRefreshSession = () => {
    return useMutation({
        mutationFn: AuthenticationService.refreshSession,
    });
};
