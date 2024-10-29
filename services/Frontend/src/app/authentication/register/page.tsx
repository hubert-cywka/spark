import { redirect } from "next/navigation";

import styles from "@/app/authentication/(shared)/styles/Authentication.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/anchor/Anchor";
import { Card } from "@/components/card/Card";
import { RegisterFormInputs } from "@/features/auth/components/registerForm/hooks/useRegisterForm";
import { RegisterForm } from "@/features/auth/components/registerForm/RegisterForm";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { logger } from "@/lib/logger/logger";
import { showToast } from "@/lib/notifications/showToast";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function Page() {
    const t = useTranslate();
    const { mutateAsync: register, isPending, isSuccess } = useRegister();

    const onRegisterFormSubmitted = async (data: RegisterFormInputs) => {
        try {
            await register(data);
            redirect(AppRoute.ACTIVATE_ACCOUNT);

            showToast().success({
                message: t("authentication.registration.notifications.success.body"),
                title: t("authentication.registration.notifications.success.title"),
            });
        } catch (err) {
            logger.error({ err });
            showToast().danger({
                message: getErrorMessage(err),
                title: t("authentication.registration.notifications.error.title"),
            });
        }
    };

    return (
        <div className={styles.container}>
            <Card>
                <h1 className={styles.header}>{t("authentication.registration.form.header")}</h1>
                <p className={styles.caption}>
                    {t("authentication.registration.form.alreadyRegistered.caption")}{" "}
                    <Anchor href={AppRoute.LOGIN}>{t("authentication.registration.form.alreadyRegistered.link")}</Anchor>
                </p>
                <RegisterForm onSubmit={onRegisterFormSubmitted} isLoading={isPending} isDisabled={isSuccess} />
            </Card>
        </div>
    );
}
