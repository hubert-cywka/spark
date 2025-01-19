import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCommonAuthenticationRequirements } from "@/features/auth/hooks";
import { useAdaptedForm } from "@/hooks/useAdaptedForm";

export type ResetPasswordFormInputs = {
    email: string;
};

export const useResetPasswordForm = () => {
    const { email } = useCommonAuthenticationRequirements();

    const requirements = yup.object({ email });

    return useAdaptedForm<ResetPasswordFormInputs>({
        resolver: yupResolver<ResetPasswordFormInputs>(requirements),
    });
};
