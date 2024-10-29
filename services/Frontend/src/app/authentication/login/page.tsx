import styles from "../(shared)/styles/Authentication.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/anchor/Anchor";
import { Card } from "@/components/card/Card";
import { LoginFormInputs } from "@/features/auth/components/loginForm/hooks/useLoginForm";
import { LoginForm } from "@/features/auth/components/loginForm/LoginForm";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function Page() {
    const t = useTranslate();
    const { mutateAsync: login, isPending, isSuccess } = useLogin();

    const onLoginFormSubmitted = async (data: LoginFormInputs) => {
        try {
            await login(data);
            showToast().success({
                message: t("authentication.login.notifications.success.body"),
                title: t("authentication.login.notifications.success.title"),
            });
        } catch (err) {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.login.notifications.error.title"),
            });
        }
    };

    return (
        <div className={styles.container}>
            <Card>
                <h1 className={styles.header}>{t("authentication.login.form.header")}</h1>
                <p className={styles.caption}>
                    {t("authentication.login.form.noAccount.caption")}{" "}
                    <Anchor href={AppRoute.REGISTER}>{t("authentication.login.form.noAccount.link")}</Anchor>
                </p>
                <p className={styles.caption}>
                    {t("authentication.login.form.accountNotActivated.caption")}{" "}
                    <Anchor href={AppRoute.ACTIVATE_ACCOUNT}>{t("authentication.login.form.accountNotActivated.link")}</Anchor>
                </p>

                <LoginForm onSubmit={onLoginFormSubmitted} isLoading={isPending} isDisabled={isSuccess}>
                    <Anchor href={AppRoute.RESET_PASSWORD}>{t("authentication.login.form.forgotPassword.link")}</Anchor>
                </LoginForm>
            </Card>
        </div>
    );
}
