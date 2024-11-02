import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";

export const useLoginWithCredentials = () => {
    return useMutation({
        mutationFn: AuthenticationService.loginWithCredentials,
    });
};
