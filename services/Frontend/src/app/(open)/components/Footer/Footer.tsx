import classNames from "clsx";

import styles from "./styles/Footer.module.scss";

import { NavigationItem } from "@/app/(open)/components/Navigation/components/NavigationItem/NavigationItem.tsx";
import { AppRoute } from "@/app/appRoute.ts";
import { Anchor } from "@/components/Anchor";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

// TODO: To env vars
const AUTHOR_SITE_URL = "https://github.com/hubert-cywka";
const AUTHOR_NAME = "@hubert-cywka";

export const Footer = () => {
    const t = useTranslate();

    return (
        <footer className={classNames(styles.footer)}>
            <div className={styles.container}>
                <div className={styles.author}>
                    {t("common.navigation.footer.madeBy")} <Anchor href={AUTHOR_SITE_URL}>{AUTHOR_NAME}</Anchor>
                </div>

                <div className={styles.links}>
                    <NavigationItem
                        href={AppRoute.TERMS_AND_CONDITIONS}
                        label={t("common.navigation.sections.legal.termsAndConditions.label")}
                    />
                </div>
            </div>
        </footer>
    );
};
