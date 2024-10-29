import { Suspense } from "react";

import styles from "@/app/authentication/shared/styles/Authentication.module.scss";

import { Card } from "@/components/card/Card";
import { AccountActivationHandler } from "@/features/auth/components/accountActivationHandler/AccountActivationHandler";
import { RequestActivationLinkForm } from "@/features/auth/components/requestActivationLinkForm/RequestAccountActivationLinkForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export default function Page() {
    const t = useTranslate();

    return (
        <div className={styles.container}>
            <Suspense>
                <AccountActivationHandler />
            </Suspense>
            <Card>
                <h1 className={styles.header}>{t("authentication.accountActivation.form.header")}</h1>
                <p className={styles.caption}>{t("authentication.accountActivation.form.caption")}</p>
                <p className={styles.caption}>{t("authentication.accountActivation.form.warning")}</p>
                <RequestActivationLinkForm />
            </Card>
        </div>
    );
}
