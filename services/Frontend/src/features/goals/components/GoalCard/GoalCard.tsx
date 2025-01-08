import { IconTarget } from "@tabler/icons-react";
import classNames from "clsx";

import styles from "./styles/GoalCard.module.scss";

import { Card } from "@/components/Card";
import { Progress } from "@/components/Progress";
import { Goal } from "@/features/goals/types/Goal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type GoalCardProps = {
    goal: Goal;
};

// TODO: Expand on click
export const GoalCard = ({ goal }: GoalCardProps) => {
    const t = useTranslate();

    return (
        <Card className={styles.container} size="1">
            <IconTarget
                className={classNames(styles.icon, {
                    [styles.accomplished]: goal.isAccomplished,
                })}
            />

            <div className={styles.nameContainer}>
                <p className={styles.deadline}>
                    {goal.deadline
                        ? `${t("goals.card.deadline.until")} ${goal.deadline.toLocaleDateString()}`
                        : t("goals.card.deadline.noDeadline")}
                </p>
                <p
                    className={classNames(styles.name, {
                        [styles.accomplished]: goal.isAccomplished,
                    })}
                >
                    {goal.name}
                </p>
            </div>

            <div className={styles.progress}>
                <p className={styles.pointsWrapper}>
                    <span className={classNames(styles.points, styles.current)}>{goal.points.current}</span>
                    <span className={classNames(styles.points, styles.target)}> / {goal.points.target}</span>
                </p>
                <Progress label={t("goals.card.progress.label")} value={(goal.points.current / goal.points.target) * 100} />
            </div>
        </Card>
    );
};
