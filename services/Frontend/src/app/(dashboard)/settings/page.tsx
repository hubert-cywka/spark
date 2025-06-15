import "server-only";

import { Section, SectionDescription, SectionTitle } from "@/app/(dashboard)/settings/components/Section";
import { SectionSeparator } from "@/app/(dashboard)/settings/components/Section/Section.tsx";
import { AppRoute } from "@/app/appRoute.ts";
import { Anchor } from "@/components/Anchor";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <Container>
            <Breadcrumbs items={[{ label: t("settings.navigation.label") }]} />

            <Section>
                <SectionTitle>
                    <Anchor href={AppRoute.ALERTS}>{t("settings.pages.alerts.label")}</Anchor>
                </SectionTitle>
                <SectionDescription>{t("settings.pages.alerts.description")}</SectionDescription>
            </Section>

            <SectionSeparator />

            <Section>
                <SectionTitle>
                    <Anchor href={AppRoute.PROFILE}>{t("settings.pages.profile.label")}</Anchor>
                </SectionTitle>
                <SectionDescription>{t("settings.pages.profile.description")}</SectionDescription>
            </Section>
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
