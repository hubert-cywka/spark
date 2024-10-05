import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { registrationFormRequirements } from "@/features/auth/components/registerForm/misc/registrationFormRequirements";

export type RegisterFormInputs = {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    hasAcceptedTermsAndConditions: boolean;
};

export const useRegisterForm = () =>
    useForm<RegisterFormInputs>({
        resolver: yupResolver<RegisterFormInputs>(registrationFormRequirements),
    });
