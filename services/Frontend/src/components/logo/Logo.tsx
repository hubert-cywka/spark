import { IconNorthStar } from "@tabler/icons-react";

import styles from "./styles/Logo.module.scss";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const Logo = () => {
    const t = useTranslate();

    return (
        <div className={styles.logo}>
            <IconNorthStar />
            <p>{t("common.app.name")}</p>
        </div>
    );
};
