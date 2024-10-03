import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { loginFormRequirements } from "@/features/auth/components/loginForm/misc/loginFormRequirements";

export type LoginFormInputs = {
    email: string;
    password: string;
};

export const useLoginForm = () =>
    useForm<LoginFormInputs>({
        resolver: yupResolver<LoginFormInputs>(loginFormRequirements),
    });
