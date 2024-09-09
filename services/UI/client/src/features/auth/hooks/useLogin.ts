import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { loginRequest, LoginRequestResponse } from "@/features/auth/api/login.request";
import { useAuthToken } from "@/features/auth/hooks/useAuthToken";
import { useUserStore } from "@/features/auth/hooks/useUserStore";

export const useLogin = () => {
    const { setToken } = useAuthToken();
    const storeUser = useUserStore((state) => state.storeUser);

    const onLoginSuccess = useCallback(
        (data: LoginRequestResponse) => {
            storeUser(data.user);
            setToken(data.token);
        },
        [storeUser, setToken]
    );

    return useMutation({ mutationFn: loginRequest, onSuccess: onLoginSuccess }).mutateAsync;
};
