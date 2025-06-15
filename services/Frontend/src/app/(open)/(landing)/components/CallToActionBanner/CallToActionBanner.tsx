import classNames from "clsx";

import styles from "./styles/CallToActionBanner.module.scss";

import { AppRoute } from "@/app/appRoute.ts";
import { Anchor } from "@/components/Anchor";
import { Button } from "@/components/Button";

// TODO: Translations
export const CallToActionBanner = () => {
    return (
        <section className={styles.container}>
            <h2 className={classNames(styles.header)}>Start journaling today</h2>
            <p className={styles.caption}>Your progress, insights, goals and pain-points in one place.</p>

            <Anchor href={AppRoute.LOGIN} className={styles.link}>
                <Button size="3" className={styles.button}>
                    Explore Spark
                </Button>
            </Anchor>
        </section>
    );
};
