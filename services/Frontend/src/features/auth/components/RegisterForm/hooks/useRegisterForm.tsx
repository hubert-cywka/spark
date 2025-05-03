import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCommonAuthenticationRequirements } from "@/features/auth/hooks";
import { useHookFormAdapter } from "@/hooks/useHookFormAdapter";

export type RegisterFormInputs = {
    email: string;
    password: string;
    confirmPassword: string;
    hasAcceptedTermsAndConditions: boolean;
};

export const useRegisterForm = () => {
    const { password, confirmPassword, email } = useCommonAuthenticationRequirements();

    const requirements = useMemo(
        () =>
            yup.object({
                email,
                password,
                confirmPassword: confirmPassword("password"),
                hasAcceptedTermsAndConditions: yup.boolean().required().isTrue(),
            }),
        [confirmPassword, email, password]
    );

    return useHookFormAdapter<RegisterFormInputs>({
        resolver: yupResolver<RegisterFormInputs>(requirements),
    });
};
