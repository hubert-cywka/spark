import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCommonAuthenticationRequirements } from "@/features/auth/hooks";
import { useHookFormAdapter } from "@/hooks/useHookFormAdapter";

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

    return useHookFormAdapter<UpdatePasswordFormInputs>({
        resolver: yupResolver<UpdatePasswordFormInputs>(requirements),
    });
};
