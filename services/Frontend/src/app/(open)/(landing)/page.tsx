import classNames from "clsx";
import { ArrowRight, SparkleIcon } from "lucide-react";

import styles from "./styles/Landing.module.scss";
import "server-only";

import { AuroraBackground } from "@/app/(open)/(landing)/components/AuroraBackground/AuroraBackground.tsx";
import { FeatureCard } from "@/app/(open)/(landing)/components/FeatureCard/FeatureCard.tsx";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { GradientText } from "@/components/GradientText/GradientText.tsx";
import { Icon } from "@/components/Icon";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore.tsx";

// TODO: Clean up + real content
function Page() {
    return (
        <Container className={styles.landingPage} size="full-width">
            <AuroraBackground />

            <div className={styles.content}>
                <main className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroHeader}>
                            <GradientText>Spark</GradientText> your career.
                        </h1>
                        <p className={styles.heroCaption}>
                            Spark helps you track daily progress, provides insights, and creates reports you can use for talks with your
                            manager.
                        </p>

                        <div className={styles.heroActions}>
                            <Button size="3" className={styles.heroActionButton} rightDecorator={<Icon slot={ArrowRight} size="1" />}>
                                Try it for free
                            </Button>
                            <Button size="3" className={styles.heroActionButton} variant="secondary">
                                Learn more
                            </Button>
                        </div>

                        <p className={styles.heroActionsCaption}>Own account is required to use Spark features.</p>
                    </div>
                </main>

                <section className={styles.features}>
                    <FeatureCard icon={SparkleIcon} title="Lorem ipsum" caption="Lorem ipsum dolor sit amet lorem ipsum dolor sit amet." />
                    <FeatureCard icon={SparkleIcon} title="Lorem ipsum" caption="Lorem ipsum dolor sit amet lorem ipsum dolor sit amet." />
                    <FeatureCard icon={SparkleIcon} title="Lorem ipsum" caption="Lorem ipsum dolor sit amet lorem ipsum dolor sit amet." />
                    <FeatureCard icon={SparkleIcon} title="Lorem ipsum" caption="Lorem ipsum dolor sit amet lorem ipsum dolor sit amet." />
                </section>

                <section className={styles.testimonials}>
                    <h2 className={classNames(styles.testimonialsHeader)}>
                        Lorem <GradientText>ipsum dolor</GradientText> sit amet
                    </h2>
                    <p className={styles.testimonialsCaption}>Lorem ipsum dolor sit amet lorem ipsum dolor sit amet</p>
                </section>

                <div className={styles.test}>
                    <h2 className={classNames(styles.testHeader)}>Lorem ipsum dolor sit amet</h2>
                    <p className={styles.testCaption}>Lorem ipsum dolor sit amet lorem ipsum dolor sit amet</p>

                    <Button size="3" className={styles.testButton}>
                        Explore Spark
                    </Button>
                </div>
            </div>
        </Container>
    );
}

export default withSessionRestore(Page, { inBackground: true });
