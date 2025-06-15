import classNames from "clsx";
import { ArrowRight } from "lucide-react";
import { Inter } from "next/font/google";

import styles from "./styles/HeroBanner.module.scss";

import { AppRoute } from "@/app/appRoute.ts";
import { Anchor } from "@/components/Anchor";
import { Button } from "@/components/Button";
import { GradientText } from "@/components/GradientText/GradientText.tsx";
import { Icon } from "@/components/Icon";

const font = Inter({ subsets: ["latin"], weight: "900" });

// TODO: Translations
export const HeroBanner = () => {
    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <h1 className={classNames(styles.header, font.className)}>
                    <GradientText>Spark</GradientText> your career.
                </h1>
                <p className={styles.caption}>
                    Spark helps you track daily progress, provides insights, and creates reports you can use for talks with your manager.
                </p>

                <div className={styles.actions}>
                    <Anchor href={AppRoute.LOGIN} className={styles.actionButton}>
                        <Button
                            size="3"
                            className={classNames(styles.actionButton, styles.primary)}
                            rightDecorator={<Icon slot={ArrowRight} size="1" />}
                        >
                            Try it for free
                        </Button>
                    </Anchor>
                    <Anchor href={AppRoute.FAQ} className={styles.actionButton}>
                        <Button size="3" className={classNames(styles.actionButton, styles.secondary)} variant="secondary">
                            Learn more
                        </Button>
                    </Anchor>
                </div>

                <p className={styles.actionsCaption}>Own account is required to use Spark features.</p>
            </div>
        </main>
    );
};
