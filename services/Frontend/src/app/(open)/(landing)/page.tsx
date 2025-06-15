import classNames from "clsx";
import { SparkleIcon } from "lucide-react";

import styles from "./styles/Landing.module.scss";
import "server-only";

import { AuroraBackground } from "@/app/(open)/(landing)/components/AuroraBackground/AuroraBackground.tsx";
import { CallToActionBanner } from "@/app/(open)/(landing)/components/CallToActionBanner/CallToActionBanner.tsx";
import { FeatureCard } from "@/app/(open)/(landing)/components/FeatureCard/FeatureCard.tsx";
import { HeroBanner } from "@/app/(open)/(landing)/components/HeroBanner/HeroBanner.tsx";
import { Container } from "@/components/Container";
import { GradientText } from "@/components/GradientText/GradientText.tsx";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore.tsx";

// TODO: Clean up + real content
function Page() {
    return (
        <Container className={styles.landingPage} size="full-width">
            <AuroraBackground />
            <HeroBanner />

            <Container size="3" className={styles.innerContainer}>
                <section className={styles.features}>
                    <FeatureCard icon={SparkleIcon} title="Lorem ipsum" caption="Lorem ipsum dolor sit amet lorem ipsum dolor sit amet." />
                    <FeatureCard icon={SparkleIcon} title="Lorem ipsum" caption="Lorem ipsum dolor sit amet lorem ipsum dolor sit amet." />
                    <FeatureCard icon={SparkleIcon} title="Lorem ipsum" caption="Lorem ipsum dolor sit amet lorem ipsum dolor sit amet." />
                    <FeatureCard icon={SparkleIcon} title="Lorem ipsum" caption="Lorem ipsum dolor sit amet lorem ipsum dolor sit amet." />
                </section>

                <section className={styles.section}>
                    <h2 className={classNames(styles.header)}>
                        Lorem <GradientText>ipsum dolor</GradientText> sit amet
                    </h2>
                    <p className={styles.caption}>Lorem ipsum dolor sit amet lorem ipsum dolor sit amet</p>
                </section>

                <CallToActionBanner />
            </Container>
        </Container>
    );
}

export default withSessionRestore(Page, { inBackground: true });
