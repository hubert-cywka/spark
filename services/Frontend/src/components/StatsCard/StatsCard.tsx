import classNames from "clsx";

import styles from "./styles/StatsCard.module.scss";

import { Card } from "@/components/Card";
import { Counter } from "@/components/Counter/Counter";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type StatsCardProps = {
    title: string;
    description: string;
    value: number | null;
    className?: string;
};

export const StatsCard = ({ title, description, value, className }: StatsCardProps) => {
    const t = useTranslate();

    return (
        <Card as="article" variant="translucent" className={classNames(styles.container, className)}>
            <div className={styles.textWrapper}>
                <p className={classNames(styles.title)}>{title}</p>
                <p className={classNames(styles.description)}>{description}</p>
            </div>

            {value !== null ? <Counter value={value} /> : <p className={styles.noValue}>{t("common.valueUnavailable.label")}</p>}
        </Card>
    );
};
