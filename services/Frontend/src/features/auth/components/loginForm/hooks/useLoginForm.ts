import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export type LoginFormInputs = {
    email: string;
    password: string;
};

export const useLoginForm = () => {
    const t = useTranslate();

    const requirements = useMemo(
        () =>
            yup.object({
                email: yup.string().required(t("authentication.common.fields.email.errors.required")),
                password: yup.string().required(t("authentication.common.fields.password.errors.required")),
            }),
        [t]
    );

    return useForm<LoginFormInputs>({
        resolver: yupResolver<LoginFormInputs>(requirements),
    });
};
