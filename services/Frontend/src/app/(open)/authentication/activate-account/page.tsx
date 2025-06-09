import { Suspense } from "react";

import styles from "@/app/(open)/authentication/shared/styles/Authentication.module.scss";
import "server-only";

import { AUTHENTICATION_SPOTLIGHT_OPACITY } from "@/app/(open)/authentication/constants.ts";
import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor";
import SpotlightCard from "@/components/SpotlightCard/SpotlightCard.tsx";
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
            <SpotlightCard as="section" spotlightOpacity={AUTHENTICATION_SPOTLIGHT_OPACITY}>
                <h1 className={styles.header}>{t("authentication.accountActivation.form.header")}</h1>
                <p className={styles.caption}>{t("authentication.accountActivation.form.caption")}</p>
                <p className={styles.caption}>{t("authentication.accountActivation.form.warning")}</p>
                <Anchor href={AppRoute.LOGIN}>{t("authentication.accountActivation.form.loginLink")}</Anchor>
                <RequestActivationLinkForm />
            </SpotlightCard>
        </main>
    );
}

export default withSessionRestore(onlyAsUnauthenticated(Page));
