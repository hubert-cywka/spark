"use client";

import styles from "@/app/authentication/(shared)/styles/Authentication.module.scss";
import sharedStyles from "@/features/auth/styles/AuthenticationForm.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/anchor/Anchor";
import { Card } from "@/components/card/Card";
import { ResetPasswordFormInputs } from "@/features/auth/components/resetPasswordForm/hooks/useResetPasswordForm";
import { ResetPasswordForm } from "@/features/auth/components/resetPasswordForm/ResetPasswordForm";
import { UpdatePasswordFormInputs } from "@/features/auth/components/updatePasswordForm/hooks/useUpdatePasswordForm";
import { UpdatePasswordForm } from "@/features/auth/components/updatePasswordForm/UpdatePasswordForm";
import { useRequestPasswordResetToken } from "@/features/auth/hooks/useRequestPasswordResetToken";
import { useUpdatePassword } from "@/features/auth/hooks/useUpdatePassword";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function Page() {
    const t = useTranslate();
    const { updatePassword, passwordChangeToken } = useUpdatePassword();

    const {
        mutateAsync: requestPasswordResetLinkMutation,
        isPending: isRequestingPasswordResetLink,
        isSuccess: hasSentPasswordResetLink,
    } = useRequestPasswordResetToken();

    const { mutateAsync: updatePasswordMutation, isPending: isUpdatingPassword, isSuccess: hasUpdatedPassword } = updatePassword;

    const onResetPasswordFormSubmit = async (payload: ResetPasswordFormInputs) => {
        try {
            await requestPasswordResetLinkMutation(payload);
            showToast().success({
                message: t("authentication.requestPasswordReset.notifications.success.body"),
                title: t("authentication.requestPasswordReset.notifications.success.title"),
            });
        } catch (err) {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.requestPasswordReset.notifications.error.title"),
            });
        }
    };

    const onUpdatePasswordFormSubmit = async ({ password }: UpdatePasswordFormInputs) => {
        if (!passwordChangeToken) {
            logger.error({ msg: "Password change token not found." });
            return;
        }

        try {
            await updatePasswordMutation({ password, passwordChangeToken });
            showToast().success({
                message: t("authentication.passwordReset.notifications.success.body"),
                title: t("authentication.passwordReset.notifications.success.title"),
            });
        } catch (err) {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.passwordReset.notifications.error.title"),
            });
        }
    };

    return (
        <div className={styles.container}>
            <Card>
                {!passwordChangeToken ? (
                    <>
                        <h1 className={sharedStyles.header}>{t("authentication.requestPasswordReset.form.header")}</h1>
                        <p className={sharedStyles.caption}>{t("authentication.requestPasswordReset.form.caption")}</p>
                        <p className={sharedStyles.caption}>
                            <Anchor href={AppRoute.LOGIN}>{t("authentication.requestPasswordReset.form.logInLink")}</Anchor>
                        </p>
                        <ResetPasswordForm
                            isDisabled={hasSentPasswordResetLink}
                            onSubmit={onResetPasswordFormSubmit}
                            isLoading={isRequestingPasswordResetLink}
                        />
                    </>
                ) : (
                    <>
                        <h1 className={sharedStyles.header}>{t("authentication.passwordReset.form.header")}</h1>
                        <p className={sharedStyles.caption}>{t("authentication.passwordReset.form.caption")}</p>
                        <p className={sharedStyles.caption}>
                            {t("authentication.passwordReset.form.logInLink.link")}{" "}
                            <Anchor href={AppRoute.LOGIN}>{t("authentication.passwordReset.form.logInLink.link")}</Anchor>
                        </p>
                        <UpdatePasswordForm
                            isDisabled={hasUpdatedPassword}
                            onSubmit={onUpdatePasswordFormSubmit}
                            isLoading={isUpdatingPassword}
                        />
                    </>
                )}
            </Card>
        </div>
    );
}
