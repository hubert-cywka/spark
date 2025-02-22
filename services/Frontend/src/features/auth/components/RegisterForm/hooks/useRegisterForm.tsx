import { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCommonAuthenticationRequirements } from "@/features/auth/hooks";
import { useHookFormAdapter } from "@/hooks/useHookFormAdapter";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const NAME_MAX_LENGTH = 30;
const NAME_REGEX = /^[a-zA-Z]([a-zA-Z\-\s']{0,29})$/;

export type RegisterFormInputs = {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    hasAcceptedTermsAndConditions: boolean;
};

export const useRegisterForm = () => {
    const t = useTranslate();
    const { password, confirmPassword, email } = useCommonAuthenticationRequirements();

    const requirements = useMemo(
        () =>
            yup.object({
                email,
                password,
                confirmPassword: confirmPassword("password"),
                firstName: yup
                    .string()
                    .required(t("authentication.common.fields.firstName.errors.required"))
                    .max(NAME_MAX_LENGTH, t("authentication.common.fields.firstName.errors.tooLong", { length: NAME_MAX_LENGTH }))
                    .matches(NAME_REGEX, t("authentication.common.fields.firstName.errors.invalid")),
                lastName: yup
                    .string()
                    .required(t("authentication.common.fields.lastName.errors.required"))
                    .max(NAME_MAX_LENGTH, t("authentication.common.fields.lastName.errors.tooLong", { length: NAME_MAX_LENGTH }))
                    .matches(NAME_REGEX, t("authentication.common.fields.lastName.errors.invalid")),
                hasAcceptedTermsAndConditions: yup.boolean().required().isTrue(),
            }),
        [confirmPassword, email, password, t]
    );

    return useHookFormAdapter<RegisterFormInputs>({
        resolver: yupResolver<RegisterFormInputs>(requirements),
    });
};
