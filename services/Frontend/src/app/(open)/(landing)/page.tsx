import { CookieIcon, GlobeIcon, SparkleIcon, TimerIcon } from "lucide-react";

import styles from "./styles/Landing.module.scss";
import "server-only";

import { AuroraBackground } from "@/app/(open)/(landing)/components/AuroraBackground/AuroraBackground.tsx";
import { CallToActionBanner } from "@/app/(open)/(landing)/components/CallToActionBanner/CallToActionBanner.tsx";
import { FeatureCard } from "@/app/(open)/(landing)/components/FeatureCard/FeatureCard.tsx";
import { HeroBanner } from "@/app/(open)/(landing)/components/HeroBanner/HeroBanner.tsx";
import { Container } from "@/components/Container";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore.tsx";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

function Page() {
    const t = useTranslate();

    return (
        <Container className={styles.landingPage} size="full-width">
            <AuroraBackground />
            <HeroBanner />

            <Container size="3" className={styles.innerContainer}>
                <section className={styles.features}>
                    <FeatureCard
                        icon={TimerIcon}
                        title={t("landingPage.features.easyToStart.title")}
                        caption={t("landingPage.features.easyToStart.caption")}
                    />
                    <FeatureCard
                        icon={SparkleIcon}
                        title={t("landingPage.features.smartInsights.title")}
                        caption={t("landingPage.features.smartInsights.caption")}
                    />
                    <FeatureCard
                        icon={GlobeIcon}
                        title={t("landingPage.features.openSource.title")}
                        caption={t("landingPage.features.openSource.caption")}
                    />
                    <FeatureCard
                        icon={CookieIcon}
                        title={t("landingPage.features.privacyFirst.title")}
                        caption={t("landingPage.features.privacyFirst.caption")}
                    />
                </section>

                <CallToActionBanner />
            </Container>
        </Container>
    );
}

export default withSessionRestore(Page, { inBackground: true });
