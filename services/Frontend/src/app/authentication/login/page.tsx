import styles from "../shared/styles/Authentication.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor";
import { Card } from "@/components/Card";
import { Divider } from "@/components/Divider";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { GoogleOAuthButton } from "@/features/oAuth/google/components/GoogleOAuthButton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export default function Page() {
    const t = useTranslate();

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

                <LoginForm>
                    <Anchor href={AppRoute.RESET_PASSWORD}>{t("authentication.login.form.forgotPassword.link")}</Anchor>
                </LoginForm>

                <Divider>{t("authentication.oauth.divider.label")}</Divider>

                <div className={styles.oAuthProviders}>
                    <GoogleOAuthButton />
                </div>
            </Card>
        </div>
    );
}
