import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { useLoginEvents } from "@/features/auth/hooks/useLoginEvents";

export const useLoginWithCredentials = () => {
    const { onLoginSuccess, onLoginError } = useLoginEvents();

    return useMutation({
        mutationFn: AuthenticationService.loginWithCredentials,
        onError: onLoginError,
        onSuccess: onLoginSuccess,
    });
};
