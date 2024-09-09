import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

import { registerRequest, RegisterRequestResponse } from "@/features/auth/api/register.request";
import { useAuthToken } from "@/features/auth/hooks/useAuthToken";
import { useUserStore } from "@/features/auth/hooks/useUserStore";

export const useRegister = () => {
    const { setToken } = useAuthToken();
    const storeUser = useUserStore((state) => state.storeUser);

    const onRegisterSuccess = useCallback(
        (data: RegisterRequestResponse) => {
            storeUser(data.user);
            setToken(data.token);
        },
        [storeUser, setToken]
    );

    return useMutation({
        mutationFn: registerRequest,
        onSuccess: onRegisterSuccess,
    }).mutateAsync;
};
