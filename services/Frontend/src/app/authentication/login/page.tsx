import styles from "../(shared)/styles/Authentication.module.scss";

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
                <LoginForm onSubmit={onLoginFormSubmitted} isLoading={isPending} isDisabled={isSuccess} />
            </Card>
        </div>
    );
}
