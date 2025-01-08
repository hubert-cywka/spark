import { useMutation } from "@tanstack/react-query";

import { PasswordService } from "@/features/auth/api/password/passwordService";

export const useRequestPasswordResetToken = () => {
    return useMutation({
        mutationFn: PasswordService.requestPasswordResetLink,
    });
};
