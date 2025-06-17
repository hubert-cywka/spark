import classNames from "clsx";
import { ArrowRight } from "lucide-react";
import { Inter } from "next/font/google";

import styles from "./styles/HeroBanner.module.scss";

import { AppRoute } from "@/app/appRoute.ts";
import { Anchor } from "@/components/Anchor";
import { Button } from "@/components/Button";
import { GradientText } from "@/components/GradientText/GradientText.tsx";
import { Icon } from "@/components/Icon";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

const font = Inter({ subsets: ["latin"], weight: "900" });

export const HeroBanner = () => {
    const t = useTranslate();

    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <GradientText>
                    <h1 className={classNames(styles.header, font.className)}>{t("landingPage.hero.header")}</h1>
                </GradientText>
                <p className={styles.caption}>{t("landingPage.hero.caption")}</p>

                <div className={styles.actions}>
                    <Anchor href={AppRoute.LOGIN} className={styles.actionButton}>
                        <Button
                            size="3"
                            className={classNames(styles.actionButton, styles.primary)}
                            rightDecorator={<Icon slot={ArrowRight} size="1" />}
                        >
                            {t("landingPage.hero.actions.tryButton.label")}
                        </Button>
                    </Anchor>
                    <Anchor href={AppRoute.FAQ} className={styles.actionButton}>
                        <Button size="3" className={classNames(styles.actionButton, styles.secondary)} variant="secondary">
                            {t("landingPage.hero.actions.learnMoreButton.label")}
                        </Button>
                    </Anchor>
                </div>

                <p className={styles.actionsCaption}>{t("landingPage.hero.actions.caption")}</p>
            </div>
        </main>
    );
};
