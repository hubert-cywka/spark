"use client";

import { useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";
import styles from "./styles/RegisterForm.module.scss";

import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Field } from "@/components/input/Field";
import { RegisterFormInputs, useRegisterForm } from "@/features/auth/components/registerForm/hooks/useRegisterForm";
import { useRegisterFormEvents } from "@/features/auth/components/registerForm/hooks/useRegisterFormEvents";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

// TODO: Finish T&C
export const RegisterForm = () => {
    const t = useTranslate();

    const { handleSubmit, control } = useRegisterForm();
    const { mutateAsync: register, isPending, isSuccess } = useRegister();
    const { onRegisterError, onRegisterSuccess } = useRegisterFormEvents();

    const onSubmit = useCallback(
        async (inputs: RegisterFormInputs) => {
            try {
                await register({
                    ...inputs,
                    email: inputs.email.trim(),
                    lastName: inputs.lastName.trim(),
                    firstName: inputs.firstName.trim(),
                });
                onRegisterSuccess();
            } catch (err) {
                onRegisterError(err);
            }
        },
        [register, onRegisterError, onRegisterSuccess]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={sharedStyles.fieldsWrapper}>
                <div className={styles.nameFieldsWrapper}>
                    <Field label={t("authentication.common.fields.firstName.label")} name="firstName" control={control} size="3" required />
                    <Field label={t("authentication.common.fields.lastName.label")} name="lastName" control={control} size="3" required />
                </div>

                <Field<RegisterFormInputs>
                    label={t("authentication.common.fields.email.label")}
                    autoComplete="email"
                    name="email"
                    control={control}
                    size="3"
                    required
                />
                <Field
                    label={t("authentication.common.fields.password.label")}
                    name="password"
                    type="password"
                    autoComplete="hidden"
                    control={control}
                    size="3"
                    required
                />
                <Field
                    label={t("authentication.common.fields.confirmPassword.label")}
                    name="confirmPassword"
                    type="password"
                    control={control}
                    autoComplete="hidden"
                    size="3"
                    required
                />

                <div className={styles.agreementsWrapper}>
                    <Checkbox name="hasAcceptedTermsAndConditions" control={control} required>
                        {t("authentication.common.fields.termsAndConditions.label")}
                    </Checkbox>
                </div>
            </div>

            <Button isLoading={isPending} isDisabled={isSuccess} size="3" type="submit">
                {t("authentication.registration.form.submitButton")}
            </Button>
        </form>
    );
};
