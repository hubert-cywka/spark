import { Suspense } from "react";

import styles from "@/app/authentication/shared/styles/Authentication.module.scss";
import "server-only";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor";
import { Card } from "@/components/Card";
import { AccountActivationHandler } from "@/features/auth/components/AccountActivationHandler";
import { RequestActivationLinkForm } from "@/features/auth/components/RequestActivationLinkForm";
import { onlyAsUnauthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <main className={styles.container}>
            <Suspense>
                <AccountActivationHandler />
            </Suspense>
            <Card as="section">
                <h1 className={styles.header}>{t("authentication.accountActivation.form.header")}</h1>
                <p className={styles.caption}>{t("authentication.accountActivation.form.caption")}</p>
                <p className={styles.caption}>{t("authentication.accountActivation.form.warning")}</p>
                <Anchor href={AppRoute.LOGIN}>{t("authentication.accountActivation.form.loginLink")}</Anchor>
                <RequestActivationLinkForm />
            </Card>
        </main>
    );
}

export default withSessionRestore(onlyAsUnauthenticated(Page));
