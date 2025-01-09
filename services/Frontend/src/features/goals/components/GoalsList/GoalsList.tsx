"use client";

import { useCallback, useState } from "react";

import styles from "./styles/GoalsList.module.scss";

import { ItemLoader } from "@/components/ItemLoader/ItemLoader";
import { GoalCard } from "@/features/goals/components/GoalCard/GoalCard";
import { GoalCardSkeleton } from "@/features/goals/components/GoalCard/GoalCardSkeleton";
import { GoalsManagementFloatingBar } from "@/features/goals/components/GoalsManagementFloatingBar/GoalsManagementFloatingBar";
import { useGoals } from "@/features/goals/hooks/get/useGoals";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";

// TODO: Handle empty state, handle error state
export const GoalsList = () => {
    const { data, fetchNextPage, isFetching, hasNextPage } = useGoals();
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

    const goals = data?.pages?.flatMap(({ data }) => data);
    const selectedGoal = goals?.find((goal) => selectedGoalId === goal.id);

    const clearSelection = useCallback(() => {
        setSelectedGoalId(null);
    }, []);

    useKeyboardShortcut({ callback: clearSelection, keys: ["Escape"] });

    return (
        <div className={styles.list}>
            {data?.pages?.map((page) =>
                page.data.map((goal) => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        isSelected={selectedGoalId === goal.id}
                        onSelection={() => setSelectedGoalId(goal.id)}
                    />
                ))
            )}

            <ItemLoader shouldLoadNext={hasNextPage} onLoadNext={fetchNextPage}>
                {isFetching && <GoalCardSkeleton count={3} />}
            </ItemLoader>

            {selectedGoal && <GoalsManagementFloatingBar selectedGoal={selectedGoal} onClose={clearSelection} />}
        </div>
    );
};
