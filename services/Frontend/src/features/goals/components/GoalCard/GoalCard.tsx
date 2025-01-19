import { useRef } from "react";
import classNames from "clsx";
import { Target } from "lucide-react";

import styles from "./styles/GoalCard.module.scss";

import { Card } from "@/components/Card";
import { Progress } from "@/components/Progress";
import { Goal } from "@/features/goals/types/Goal";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type GoalCardProps = {
    goal: Goal;
    isSelected: boolean;
    onSelection?: () => unknown;
};

export const GoalCard = ({ goal, isSelected, onSelection }: GoalCardProps) => {
    const isFocused = useRef(false);
    const t = useTranslate();

    const handleOnEnter = () => {
        if (isFocused.current) {
            onSelection?.();
        }
    };

    const handleFocus = () => {
        isFocused.current = true;
    };

    const handleBlur = () => {
        isFocused.current = false;
    };

    useKeyboardShortcut({
        callback: handleOnEnter,
        keys: ["Enter", "Space"],
    });

    return (
        <Card
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={0}
            onClick={onSelection}
            className={classNames(styles.container, {
                [styles.selected]: isSelected,
            })}
            size="1"
        >
            <Target
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
                    <span className={classNames(styles.points, styles.current)}>{goal.targetProgress}</span>
                    <span className={classNames(styles.points, styles.target)}> / {goal.target}</span>
                </p>
                <Progress label={t("goals.card.progress.label")} value={(goal.targetProgress / goal.target) * 100} />
            </div>
        </Card>
    );
};
