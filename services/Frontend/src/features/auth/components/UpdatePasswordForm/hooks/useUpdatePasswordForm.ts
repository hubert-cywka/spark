import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCommonAuthenticationRequirements } from "@/features/auth/hooks";
import { useAdaptedForm } from "@/hooks/useAdaptedForm";

export type UpdatePasswordFormInputs = {
    password: string;
    confirmPassword: string;
};

export const useUpdatePasswordForm = () => {
    const { password, confirmPassword } = useCommonAuthenticationRequirements();

    const requirements = yup.object({
        password,
        confirmPassword: confirmPassword("password"),
    });

    return useAdaptedForm<UpdatePasswordFormInputs>({
        resolver: yupResolver<UpdatePasswordFormInputs>(requirements),
    });
};
