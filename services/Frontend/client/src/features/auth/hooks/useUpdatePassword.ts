import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { PasswordService } from "@/features/auth/api/passwordService";

const PASSWORD_RESET_TOKEN_QUERY_PARAM_NAME = "token";

export const useUpdatePassword = () => {
    const [searchParams] = useSearchParams();
    const passwordChangeToken = useMemo(() => searchParams.get(PASSWORD_RESET_TOKEN_QUERY_PARAM_NAME), [searchParams]);

    const updatePassword = useMutation({
        mutationFn: PasswordService.updatePassword,
    });

    return { updatePassword, passwordChangeToken };
};
