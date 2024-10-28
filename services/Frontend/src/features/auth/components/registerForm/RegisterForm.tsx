import { useCallback } from "react";
import { FormProvider } from "react-hook-form";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";
import styles from "./styles/RegisterForm.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Field } from "@/components/input/Field";
import { RegisterFormInputs, useRegisterForm } from "@/features/auth/components/registerForm/hooks/useRegisterForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type RegisterFormProps = FormProps<RegisterFormInputs>;

// TODO: Finish T&C
export const RegisterForm = ({ onSubmit, isLoading, isDisabled }: RegisterFormProps) => {
    const t = useTranslate();
    const form = useRegisterForm();
    const { handleSubmit, control } = form;

    const internalOnSubmit = useCallback(
        (inputs: RegisterFormInputs) => {
            onSubmit({
                ...inputs,
                email: inputs.email.trim(),
                lastName: inputs.lastName.trim(),
                firstName: inputs.firstName.trim(),
            });
        },
        [onSubmit]
    );

    return (
        <FormProvider {...form}>
            <form className={sharedStyles.form} onSubmit={handleSubmit(internalOnSubmit)}>
                <h1 className={sharedStyles.header}>{t("authentication.registration.form.header")}</h1>
                <p className={sharedStyles.caption}>
                    {t("authentication.registration.form.alreadyRegistered.caption")}{" "}
                    <Anchor href={AppRoute.LOGIN}>{t("authentication.registration.form.alreadyRegistered.link")}</Anchor>
                </p>

                <div className={sharedStyles.fieldsWrapper}>
                    <div className={styles.nameFieldsWrapper}>
                        <Field
                            label={t("authentication.common.fields.firstName.label")}
                            name="firstName"
                            control={control}
                            size="3"
                            required
                        />
                        <Field
                            label={t("authentication.common.fields.lastName.label")}
                            name="lastName"
                            control={control}
                            size="3"
                            required
                        />
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

                <Button isLoading={isLoading} isDisabled={isDisabled} size="3" type="submit">
                    {t("authentication.registration.form.submitButton")}
                </Button>
            </form>
        </FormProvider>
    );
};
