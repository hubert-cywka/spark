import classNames from "clsx";

import styles from "./styles/StatsCard.module.scss";

import { Card } from "@/components/Card";
import { Counter } from "@/components/Counter/Counter";

type StatsCardProps = {
    title: string;
    value: number;
    className?: string;
};

export const StatsCard = ({ title, value, className }: StatsCardProps) => {
    return (
        <Card variant="translucent" className={classNames(styles.container, className)}>
            <p className={styles.title}>{title}</p>
            <Counter value={value} />
        </Card>
    );
};
