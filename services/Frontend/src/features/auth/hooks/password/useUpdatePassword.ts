import { useMutation } from "@tanstack/react-query";

import { PasswordService } from "@/features/auth/api/password/passwordService";

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: PasswordService.updatePassword,
    });
};
