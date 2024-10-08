import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCommonAuthenticationRequirements } from "@/features/auth/schemas/useCommonAuthenticationRequirements";

export type ResetPasswordFormInputs = {
    email: string;
};

export const useResetPasswordForm = () => {
    const { email } = useCommonAuthenticationRequirements();

    const requirements = yup.object({ email });

    return useForm<ResetPasswordFormInputs>({
        resolver: yupResolver<ResetPasswordFormInputs>(requirements),
    });
};
