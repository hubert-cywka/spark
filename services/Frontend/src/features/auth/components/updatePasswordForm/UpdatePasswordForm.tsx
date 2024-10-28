import sharedStyles from "../../styles/AuthenticationForm.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/anchor/Anchor";
import { Button } from "@/components/button/Button";
import { Field } from "@/components/input/Field";
import { UpdatePasswordFormInputs, useUpdatePasswordForm } from "@/features/auth/components/updatePasswordForm/hooks/useUpdatePasswordForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { FormProps } from "@/types/Form";

type UpdatePasswordFormProps = FormProps<UpdatePasswordFormInputs>;

export const UpdatePasswordForm = ({ isLoading, onSubmit, isDisabled }: UpdatePasswordFormProps) => {
    const t = useTranslate();
    const { handleSubmit, control } = useUpdatePasswordForm();

    return (
        <form className={sharedStyles.form} onSubmit={handleSubmit(onSubmit)}>
            <h1 className={sharedStyles.header}>{t("authentication.passwordReset.form.header")}</h1>
            <p className={sharedStyles.caption}>{t("authentication.passwordReset.form.caption")}</p>
            <p className={sharedStyles.caption}>
                {t("authentication.passwordReset.form.logInLink.link")}{" "}
                <Anchor href={AppRoute.LOGIN}>{t("authentication.passwordReset.form.logInLink.link")}</Anchor>
            </p>

            <div className={sharedStyles.fieldsWrapper}>
                <Field
                    label={t("authentication.common.fields.password.label")}
                    name="password"
                    type="password"
                    control={control}
                    size="3"
                    required
                />
                <Field
                    label={t("authentication.common.fields.confirmPassword.label")}
                    name="confirmPassword"
                    type="password"
                    control={control}
                    size="3"
                    required
                />
            </div>

            <Button isLoading={isLoading} isDisabled={isDisabled} size="3" type="submit">
                {t("authentication.passwordReset.form.submitButton")}
            </Button>
        </form>
    );
};
