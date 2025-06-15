import { CookieIcon, GlobeIcon, SparkleIcon, TimerIcon } from "lucide-react";

import styles from "./styles/Landing.module.scss";
import "server-only";

import { AuroraBackground } from "@/app/(open)/(landing)/components/AuroraBackground/AuroraBackground.tsx";
import { CallToActionBanner } from "@/app/(open)/(landing)/components/CallToActionBanner/CallToActionBanner.tsx";
import { FeatureCard } from "@/app/(open)/(landing)/components/FeatureCard/FeatureCard.tsx";
import { HeroBanner } from "@/app/(open)/(landing)/components/HeroBanner/HeroBanner.tsx";
import { Container } from "@/components/Container";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore.tsx";

// TODO: Clean up + real content
function Page() {
    return (
        <Container className={styles.landingPage} size="full-width">
            <AuroraBackground />
            <HeroBanner />

            <Container size="3" className={styles.innerContainer}>
                <section className={styles.features}>
                    <FeatureCard
                        icon={TimerIcon}
                        title="Easy to start"
                        caption="Sign up and create your first entry in 2 minutes. Spend just 5 minutes per-day on journalling."
                    />
                    <FeatureCard
                        icon={SparkleIcon}
                        title="Smart insights"
                        caption="Spark will provide insights based on your journaling habits, so you can create entries of higher quality."
                    />
                    <FeatureCard
                        icon={GlobeIcon}
                        title="Open-source"
                        caption="We have nothing to hide; Spark's code is publicly available. You can also host Spark on your own."
                    />
                    <FeatureCard
                        icon={CookieIcon}
                        title="Privacy-first"
                        caption="Cookies are for authentication, not for tracking. We don't share your data with third parties. We never will."
                    />
                </section>

                <CallToActionBanner />
            </Container>
        </Container>
    );
}

export default withSessionRestore(Page, { inBackground: true });
