import classNames from "clsx";
import { CheckIcon, LightbulbIcon } from "lucide-react";

import styles from "./styles/KeyInsightsSummary.module.scss";

import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { Insight } from "@/features/insights/types/Insights";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type KeyInsightsSummaryProps = {
    insights: Insight[];
    className?: string;
};

export const KeyInsightsSummary = ({ insights, className }: KeyInsightsSummaryProps) => {
    const t = useTranslate();

    const negativeInsights = insights.filter((insight) => insight.score < 0);
    const positiveInsights = insights.filter((insight) => insight.score > 0);

    return (
        <Card as="article" variant="translucent" className={classNames(styles.summary, className)}>
            {!insights.length && (
                <section className={styles.section}>
                    <h3 className={classNames(styles.header, styles.warning)}>{t("insights.summary.notEnoughData.header")}</h3>
                    <p className={styles.notEnoughDataCaption}>{t("insights.summary.notEnoughData.caption")}</p>
                </section>
            )}

            {!!negativeInsights.length && (
                <section className={styles.section}>
                    <h3 className={classNames(styles.header, styles.negative)}>
                        {t("insights.summary.sections.negative.header")}
                        <Icon slot={LightbulbIcon} />
                    </h3>

                    <ul className={styles.insightsList}>
                        {negativeInsights.map((insight) => (
                            <li key={insight.key}>{insight.description}</li>
                        ))}
                    </ul>
                </section>
            )}

            {!!positiveInsights.length && (
                <section className={styles.section}>
                    <h3 className={classNames(styles.header, styles.positive)}>
                        {t("insights.summary.sections.positive.header")}
                        <Icon slot={CheckIcon} />
                    </h3>

                    <ul className={styles.insightsList}>
                        {positiveInsights.map((insight) => (
                            <li key={insight.key}>{insight.description}</li>
                        ))}
                    </ul>
                </section>
            )}

            <p className={styles.caption}>{t("insights.summary.caption")}</p>
        </Card>
    );
};
