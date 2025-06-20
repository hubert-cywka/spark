import styles from "./styles/NoRecordsMessage.module.scss";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const NoRecordsMessage = () => {
    const t = useTranslate();

    return (
        <section className={styles.container}>
            <h3 className={styles.title}>{t("reports.grid.noData.title")}</h3>
            <p className={styles.caption}>{t("reports.grid.noData.caption")}</p>
        </section>
    );
};
