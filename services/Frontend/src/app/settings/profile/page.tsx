import styles from "./styles/ProfilePage.module.scss";
import "server-only";

import { AppRoute } from "@/app/appRoute";
import { Section, SectionDescription, SectionTitle } from "@/app/settings/components/Section";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { AccountTerminationForm } from "@/features/user/components/AccountTerminationForm";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <Container>
            <Breadcrumbs
                items={[
                    {
                        label: t("settings.navigation.label"),
                        href: AppRoute.SETTINGS,
                    },
                    { label: t("settings.navigation.profile.label") },
                ]}
            />

            <Section>
                <SectionTitle className={styles.danger}>{t("settings.profile.accountTermination.header")}</SectionTitle>
                <SectionDescription>{t("settings.profile.accountTermination.description")}</SectionDescription>
                <AccountTerminationForm />
            </Section>
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
