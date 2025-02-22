"use client";

import styles from "./styles/GoalPageDashboard.module.scss";

import { GoalEntriesList } from "@/app/goals/[id]/components/GoalEntriesList";
import { GoalPageHeader } from "@/app/goals/[id]/components/GoalPageHeader";
import { LoadingOverlay } from "@/components/LoadingOverlay/LoadingOverlay";
import { useEntries } from "@/features/entries/hooks";
import { GoalCard } from "@/features/goals/components/GoalCard";
import { useGoal } from "@/features/goals/hooks/useGoals/useGoal";

type EntriesProps = {
    goalId: string;
};

// TODO: Handle errors and empty state
export const GoalPageDashboard = ({ goalId }: EntriesProps) => {
    const { data } = useEntries({ goals: [goalId] });
    const entries = data?.pages.flatMap((page) => page.data) ?? [];

    const { data: goal } = useGoal({ goalId });

    if (!goal) {
        return <LoadingOverlay />;
    }

    return (
        <div className={styles.container}>
            <GoalPageHeader goalName={goal.name} />
            <GoalCard goal={goal} />
            <GoalEntriesList entries={entries} goalId={goalId} />
        </div>
    );
};
