import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { PasswordService } from "@/features/auth/api/passwordService";

const PASSWORD_RESET_TOKEN_QUERY_PARAM_NAME = "token";

export const usePasswordReset = () => {
    const [searchParams] = useSearchParams();

    const updatePassword = useMutation({
        mutationFn: PasswordService.updatePassword,
    });
    const requestPasswordReset = useMutation({
        mutationFn: PasswordService.requestPasswordResetLink,
    });
    const passwordResetToken = useMemo(() => searchParams.get(PASSWORD_RESET_TOKEN_QUERY_PARAM_NAME), [searchParams]);

    return { updatePassword, requestPasswordReset, passwordResetToken };
};
