import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { resetPasswordFormRequirements } from "@/features/auth/components/resetPasswordForm/misc/resetPasswordFormRequirements";

export type ResetPasswordFormInputs = {
    email: string;
};

export const useResetPasswordForm = () =>
    useForm<ResetPasswordFormInputs>({
        resolver: yupResolver<ResetPasswordFormInputs>(resetPasswordFormRequirements),
    });
