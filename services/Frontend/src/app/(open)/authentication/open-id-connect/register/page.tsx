import styles from "@/app/(open)/authentication/shared/styles/Authentication.module.scss";
import "server-only";

import { AUTHENTICATION_SPOTLIGHT_OPACITY } from "@/app/(open)/authentication/constants.ts";
import SpotlightCard from "@/components/SpotlightCard/SpotlightCard.tsx";
import { CreateAccountWithOIDCForm } from "@/features/auth/components/CreateAccountWithOIDCForm";
import { onlyAsUnauthenticated } from "@/features/auth/hoc/withAuthorization";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <main className={styles.container}>
            <SpotlightCard as="section" spotlightOpacity={AUTHENTICATION_SPOTLIGHT_OPACITY}>
                <h1 className={styles.header}>{t("authentication.oidc.register.form.header")}</h1>
                <p className={styles.caption}>{t("authentication.oidc.register.form.description")}</p>
                <CreateAccountWithOIDCForm />
            </SpotlightCard>
        </main>
    );
}

export default onlyAsUnauthenticated(Page);
