import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { updatePasswordFormRequirements } from "@/features/auth/components/updatePasswordForm/misc/updatePasswordFormRequirements";

export type UpdatePasswordFormInputs = {
    password: string;
    confirmPassword: string;
};

export const useUpdatePasswordForm = () =>
    useForm<UpdatePasswordFormInputs>({
        resolver: yupResolver<UpdatePasswordFormInputs>(updatePasswordFormRequirements),
    });
