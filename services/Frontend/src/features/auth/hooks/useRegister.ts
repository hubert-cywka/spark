import { useMutation } from "@tanstack/react-query";

import { AuthenticationService } from "@/features/auth/api/authenticationService";
import { useRegisterEvents } from "@/features/auth/hooks/useRegisterEvents";

export const useRegister = () => {
    const { onRegisterError, onRegisterSuccess } = useRegisterEvents();

    return useMutation({
        mutationFn: AuthenticationService.register,
        onSuccess: onRegisterSuccess,
        onError: onRegisterError,
    });
};
