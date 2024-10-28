import { useCallback, useMemo } from "react";
import * as yup from "yup";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const PASSWORD_MIN_LENGTH = 8;

export const useCommonAuthenticationRequirements = () => {
    const t = useTranslate();

    const email = useMemo(
        () =>
            yup
                .string()
                .required(t("authentication.common.fields.email.errors.required"))
                .email(t("authentication.common.fields.email.errors.invalid")),
        [t]
    );

    const password = useMemo(
        () =>
            yup
                .string()
                .required(
                    t("authentication.common.fields.password.errors.weak", {
                        length: PASSWORD_MIN_LENGTH,
                    })
                )
                .min(
                    PASSWORD_MIN_LENGTH,
                    t("authentication.common.fields.password.errors.weak", {
                        length: PASSWORD_MIN_LENGTH,
                    })
                ),
        [t]
    );

    const confirmPassword = useCallback(
        (passwordFieldName: string) =>
            yup
                .string()
                .required(t("authentication.common.fields.confirmPassword.errors.mismatch"))
                .oneOf([yup.ref(passwordFieldName)], t("authentication.common.fields.confirmPassword.errors.mismatch")),
        [t]
    );

    return { email, password, confirmPassword };
};
