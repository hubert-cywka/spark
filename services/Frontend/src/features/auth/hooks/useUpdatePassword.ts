import { useMutation } from "@tanstack/react-query";

import { PasswordService } from "@/features/auth/api/passwordService";
import { useUpdatePasswordEvents } from "@/features/auth/hooks/useUpdatePasswordEvents";

export const useUpdatePassword = () => {
    const { onPasswordUpdateError, onPasswordUpdateSuccess } = useUpdatePasswordEvents();

    return useMutation({
        mutationFn: PasswordService.updatePassword,
        onError: onPasswordUpdateError,
        onSuccess: onPasswordUpdateSuccess,
    });
};
