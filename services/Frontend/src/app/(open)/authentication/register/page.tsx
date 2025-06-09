import styles from "@/app/(open)/authentication/shared/styles/Authentication.module.scss";
import "server-only";

import { AUTHENTICATION_SPOTLIGHT_OPACITY } from "@/app/(open)/authentication/constants.ts";
import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor";
import SpotlightCard from "@/components/SpotlightCard/SpotlightCard.tsx";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { onlyAsUnauthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <main className={styles.container}>
            <SpotlightCard as="section" spotlightOpacity={AUTHENTICATION_SPOTLIGHT_OPACITY}>
                <h1 className={styles.header}>{t("authentication.registration.form.header")}</h1>
                <p className={styles.caption}>
                    {t("authentication.registration.form.alreadyRegistered.caption")}{" "}
                    <Anchor href={AppRoute.LOGIN}>{t("authentication.registration.form.alreadyRegistered.link")}</Anchor>
                </p>
                <RegisterForm />
            </SpotlightCard>
        </main>
    );
}

export default withSessionRestore(onlyAsUnauthenticated(Page));
