import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { useAuthToken } from "@/features/auth/hooks/useAuthToken";
import { LoginRequestResponse } from "@/features/auth/types/authentication";

export const useLogin = () => {
    const { setToken } = useAuthToken();

    const onLoginSuccess = useCallback(
        (data: LoginRequestResponse) => {
            setToken(data.accessToken);
        },
        [setToken]
    );

    return useMutation({
        mutationFn: AuthenticationService.login,
        onSuccess: onLoginSuccess,
    });
};
