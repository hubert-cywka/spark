import { ArrowRight } from "lucide-react";

import styles from "./styles/GoalsList.module.scss";

import { AppRoute } from "@/app/appRoute";
import { Anchor } from "@/components/Anchor";
import { Card } from "@/components/Card";
import { Divider } from "@/components/Divider";
import { Icon } from "@/components/Icon";
import { GoalCard } from "@/features/goals/components/GoalCard";
import { Goal } from "@/features/goals/types/Goal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type GoalsListSectionProps = {
    goals: Goal[];
    header: string;
    selectedGoalId: string | null;
    onSelectGoal: (goalId: string) => void;
    isLoading?: boolean;
};

export const GoalsList = ({ goals, header, selectedGoalId, onSelectGoal, isLoading }: GoalsListSectionProps) => {
    const t = useTranslate();

    return (
        <section>
            <header>
                <Divider>{header}</Divider>
            </header>
            {!goals.length && !isLoading && <p className={styles.noResults}>{t("goals.list.section.noResults")}</p>}

            <ul className={styles.list}>
                {goals.map((goal) => (
                    <li key={goal.id} className={styles.listItem}>
                        <GoalCard goal={goal} isSelected={selectedGoalId === goal.id} onSelection={onSelectGoal} />

                        <Anchor href={AppRoute.GOAL.replace(":id", goal.id)}>
                            <Card variant="semi-translucent" className={styles.navigationCard}>
                                <Icon slot={ArrowRight} className={styles.navigationIcon} />
                            </Card>
                        </Anchor>
                    </li>
                ))}
            </ul>
        </section>
    );
};
