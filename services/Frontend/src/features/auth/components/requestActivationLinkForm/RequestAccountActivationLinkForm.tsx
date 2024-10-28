import { useCallback } from "react";

import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import {
    RequestAccountActivationFormInputs,
    useRequestAccountActivationLinkForm,
} from "@/features/auth/components/requestActivationLinkForm/hooks/useRequestAccountActivationLinkForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type RequestActivationLinkFormProps = FormProps<RequestAccountActivationFormInputs>;

export const RequestActivationLinkForm = ({ onSubmit, isLoading, isDisabled }: RequestActivationLinkFormProps) => {
    const t = useTranslate();
    const { control, handleSubmit } = useRequestAccountActivationLinkForm();

    const internalOnSubmit = useCallback(
        (inputs: RequestAccountActivationFormInputs) => {
            onSubmit({ email: inputs.email.trim() });
        },
        [onSubmit]
    );

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(internalOnSubmit)}>
            <h1 className={sharedStyles.header}>{t("authentication.accountActivation.form.header")}</h1>
            <p className={sharedStyles.caption}>{t("authentication.accountActivation.form.caption")}</p>
            <p className={sharedStyles.caption}>{t("authentication.accountActivation.form.warning")}</p>

            <div className={sharedStyles.fieldsWrapper}>
                <Field
                    label={t("authentication.common.fields.email.label")}
                    name="email"
                    control={control}
                    autoComplete="email"
                    size="3"
                    required
                />
            </div>

            <Button type="submit" isLoading={isLoading} isDisabled={isDisabled} size="3">
                {t("authentication.accountActivation.form.submitButton")}
            </Button>
        </form>
    );
};
