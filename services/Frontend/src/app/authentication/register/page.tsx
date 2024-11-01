import styles from "@/app/authentication/shared/styles/Authentication.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor";
import { Card } from "@/components/Card";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export default function Page() {
    const t = useTranslate();

    return (
        <div className={styles.container}>
            <Card>
                <h1 className={styles.header}>{t("authentication.registration.form.header")}</h1>
                <p className={styles.caption}>
                    {t("authentication.registration.form.alreadyRegistered.caption")}{" "}
                    <Anchor href={AppRoute.LOGIN}>{t("authentication.registration.form.alreadyRegistered.link")}</Anchor>
                </p>
                <RegisterForm />
            </Card>
        </div>
    );
}
