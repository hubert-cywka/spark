import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { loginRequest, LoginRequestResponse } from "@/features/auth/api/login.request";
import { useAuthToken } from "@/features/auth/hooks/useAuthToken";

export const useLogin = () => {
    const { setToken } = useAuthToken();

    const onLoginSuccess = useCallback(
        (data: LoginRequestResponse) => {
            setToken(data.token);
        },
        [setToken]
    );

    return useMutation({ mutationFn: loginRequest, onSuccess: onLoginSuccess });
};
