import classNames from "clsx";

import styles from "./styles/StatsCard.module.scss";

import { Card } from "@/components/Card";
import { Counter } from "@/components/Counter/Counter";

type StatsCardProps = {
    title: string;
    description: string;
    value: number;
    className?: string;
};

export const StatsCard = ({ title, description, value, className }: StatsCardProps) => {
    return (
        <Card as="article" variant="translucent" className={classNames(styles.container, className)}>
            <div className={styles.textWrapper}>
                <p className={classNames(styles.title)}>{title}</p>
                <p className={classNames(styles.description)}>{description}</p>
            </div>
            <Counter value={value} />
        </Card>
    );
};
