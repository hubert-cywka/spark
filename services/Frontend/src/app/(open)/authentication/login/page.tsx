import styles from "../shared/styles/Authentication.module.scss";
import "server-only";

import { AUTHENTICATION_SPOTLIGHT_OPACITY } from "@/app/(open)/authentication/constants.ts";
import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor";
import { Divider } from "@/components/Divider";
import SpotlightCard from "@/components/SpotlightCard/SpotlightCard.tsx";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { onlyAsUnauthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { GoogleOIDCButton } from "@/features/auth/oidc/providers/google/components/GoogleOIDCButton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <main className={styles.container}>
            <SpotlightCard as="section" spotlightOpacity={AUTHENTICATION_SPOTLIGHT_OPACITY}>
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

                <Divider>{t("authentication.oidc.divider.label")}</Divider>

                <div className={styles.openIDConnectProviders}>
                    <GoogleOIDCButton />
                </div>
            </SpotlightCard>
        </main>
    );
}

export default withSessionRestore(onlyAsUnauthenticated(Page));
