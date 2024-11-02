import { useMutation } from "@tanstack/react-query";

import { PasswordService } from "@/features/auth/api/passwordService";
import { useRequestAccountActivationTokenEvents } from "@/features/auth/hooks/useRequestAccountActivationTokenEvents";

export const useRequestPasswordResetToken = () => {
    const { onRequestActivationError, onRequestActivationSuccess } = useRequestAccountActivationTokenEvents();

    return useMutation({
        mutationFn: PasswordService.requestPasswordResetLink,
        onError: onRequestActivationError,
        onSuccess: onRequestActivationSuccess,
    });
};
