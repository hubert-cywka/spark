import styles from "./styles/NoRecordsFallback.module.scss";

import { Spinner } from "@/components/Spinner";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type NoRecordsFallbackProps = {
    isLoading?: boolean;
};

export const NoRecordsFallback = ({ isLoading }: NoRecordsFallbackProps) => {
    if (isLoading) {
        return <LoadingRecordsMessage />;
    }

    return <NoRecordsMessage />;
};

const NoRecordsMessage = () => {
    const t = useTranslate();

    return (
        <section className={styles.container}>
            <h3 className={styles.title}>{t("reports.grid.noData.title")}</h3>
            <p className={styles.caption}>{t("reports.grid.noData.caption")}</p>
        </section>
    );
};

const LoadingRecordsMessage = () => {
    const t = useTranslate();

    return (
        <section className={styles.container}>
            <h3 className={styles.title}>{t("reports.grid.loading.title")}</h3>
            <p className={styles.caption}>{t("reports.grid.loading.caption")}</p>
            <Spinner className={styles.spinner} />
        </section>
    );
};
