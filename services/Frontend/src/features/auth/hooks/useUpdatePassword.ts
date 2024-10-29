import { useMutation } from "@tanstack/react-query";

import { PasswordService } from "@/features/auth/api/passwordService";

export const useUpdatePassword = () => {
    const updatePassword = useMutation({
        mutationFn: PasswordService.updatePassword,
    });

    return { updatePassword };
};
