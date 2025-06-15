import classNames from "clsx";

import styles from "./styles/CallToActionBanner.module.scss";

import { AppRoute } from "@/app/appRoute.ts";
import { Anchor } from "@/components/Anchor";
import { Button } from "@/components/Button";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const CallToActionBanner = () => {
    const t = useTranslate();

    return (
        <section className={styles.container}>
            <h2 className={classNames(styles.header)}>{t("landingPage.callToAction.header")}</h2>
            <p className={styles.caption}>{t("landingPage.callToAction.caption")}</p>

            <Anchor href={AppRoute.LOGIN} className={styles.link}>
                <Button size="3" className={styles.button}>
                    {t("landingPage.callToAction.buttonLabel")}
                </Button>
            </Anchor>
        </section>
    );
};
