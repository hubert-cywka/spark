import { IconTarget } from "@tabler/icons-react";
import classNames from "clsx";

import styles from "./styles/GoalCard.module.scss";

import { Card } from "@/components/Card";
import { Progress } from "@/components/Progress";
import { Goal } from "@/features/goals/types/Goal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

// TODO: Expand on click
export const GoalCard = ({ name, deadline, points, isAccomplished }: Goal) => {
    const t = useTranslate();

    return (
        <Card className={styles.container}>
            <IconTarget
                className={classNames(styles.icon, {
                    [styles.accomplished]: isAccomplished,
                })}
            />

            <div className={styles.nameContainer}>
                <p className={styles.deadline}>
                    {deadline ? `${t("goals.card.deadline.until")} ${deadline.toLocaleDateString()}` : t("goals.card.deadline.noDeadline")}
                </p>
                <p
                    className={classNames(styles.name, {
                        [styles.accomplished]: isAccomplished,
                    })}
                >
                    {name}
                </p>
            </div>

            <div className={styles.progress}>
                <p className={styles.pointsWrapper}>
                    <span className={classNames(styles.points, styles.current)}>{points.current}</span>
                    <span className={classNames(styles.points, styles.target)}> / {points.target}</span>
                </p>
                <Progress label={t("goals.card.progress.label")} value={points.current / points.target} />
            </div>
        </Card>
    );
};
