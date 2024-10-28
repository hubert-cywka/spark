"use client";

import styles from "@/app/authentication/(shared)/styles/Authentication.module.scss";

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
                    <ResetPasswordForm
                        isDisabled={hasSentPasswordResetLink}
                        onSubmit={onResetPasswordFormSubmit}
                        isLoading={isRequestingPasswordResetLink}
                    />
                ) : (
                    <UpdatePasswordForm
                        isDisabled={hasUpdatedPassword}
                        onSubmit={onUpdatePasswordFormSubmit}
                        isLoading={isUpdatingPassword}
                    />
                )}
            </Card>
        </div>
    );
}
