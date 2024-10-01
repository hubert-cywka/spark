import * as yup from "yup";

import { UseBaseForm, useBaseForm } from "@/hooks/useBaseForm";

export type LoginFormInputs = {
    email: string;
    password: string;
};

const loginFormSchema = yup.object({
    email: yup.string().required("Email is required."),
    password: yup.string().required("Password is required."),
});

export const useLoginForm = (): UseBaseForm<LoginFormInputs> => useBaseForm<LoginFormInputs>(loginFormSchema);
