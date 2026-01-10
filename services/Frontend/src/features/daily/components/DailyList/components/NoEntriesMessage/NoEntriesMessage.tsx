import { useLocale } from "next-intl";

import styles from "./styles/NoDailiesMessage.module.scss";

import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type NoDailiesMessageProps = {
    timeframeStart: Date;
};

export const NoEntriesMessage = ({ timeframeStart }: NoDailiesMessageProps) => {
    const t = useTranslate();
    const locale = useLocale();

    return (
        <section className={styles.container}>
            <h2 className={styles.header}>{t("daily.empty.title")}</h2>
            <p className={styles.caption}>
                {t("daily.empty.caption", {
                    date: timeframeStart.toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                    }),
                })}
            </p>
        </section>
    );
};
