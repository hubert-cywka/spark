import styles from "./styles/ProfilePage.module.scss";
import "server-only";

import { Section, SectionDescription, SectionTitle } from "@/app/(dashboard)/settings/components/Section";
import { SectionSeparator } from "@/app/(dashboard)/settings/components/Section/Section.tsx";
import { AppRoute } from "@/app/appRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { TwoFactorAuthenticationConfiguration } from "@/features/auth/components/TwoFactorAuthenticationConfiguration";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { ExportEntriesDashboard } from "@/features/export/components/ExportEntriesDashboard/ExportEntriesDashboard.tsx";
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
                <SectionTitle>{t("settings.profile.2fa.header")}</SectionTitle>
                <SectionDescription>{t("settings.profile.2fa.description")}</SectionDescription>
                <TwoFactorAuthenticationConfiguration />
            </Section>

            <SectionSeparator />

            <Section>
                <SectionTitle>{t("settings.profile.exports.header")}</SectionTitle>
                <SectionDescription>{t("settings.profile.exports.description")}</SectionDescription>
                <ExportEntriesDashboard />
            </Section>

            <SectionSeparator />

            <Section>
                <SectionTitle>{t("settings.profile.logoutFromAllDevices.header")}</SectionTitle>
                <SectionDescription>{t("settings.profile.logoutFromAllDevices.description")}</SectionDescription>
                <LogoutButton logoutFromAllSessions variant="primary" />
            </Section>

            <SectionSeparator />

            <Section>
                <SectionTitle className={styles.danger}>{t("settings.profile.accountTermination.header")}</SectionTitle>
                <SectionDescription>{t("settings.profile.accountTermination.description")}</SectionDescription>
                <AccountTerminationForm />
            </Section>
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
