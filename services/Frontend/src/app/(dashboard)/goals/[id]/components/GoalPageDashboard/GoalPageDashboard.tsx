"use client";

import { useState } from "react";

import styles from "./styles/GoalPageDashboard.module.scss";

import { GoalEntriesList } from "@/app/(dashboard)/goals/[id]/components/GoalEntriesList";
import { GoalPageHeader } from "@/app/(dashboard)/goals/[id]/components/GoalPageHeader";
import { LoadingOverlay } from "@/components/LoadingOverlay/LoadingOverlay";
import { EntryFiltersGroup } from "@/features/entries/components/EntryFiltersGroup";
import { useEntries } from "@/features/entries/hooks";
import { GoalCard } from "@/features/goals/components/GoalCard";
import { useGoal } from "@/features/goals/hooks/useGoal";

type EntriesProps = {
    goalId: string;
};

// TODO: Handle errors and empty state
export const GoalPageDashboard = ({ goalId }: EntriesProps) => {
    const [filters, setFilters] = useState<{
        completed?: boolean;
        featured?: boolean;
    }>({});

    const { data } = useEntries({
        autoFetch: true,
        filters: {
            goals: [goalId],
            featured: filters.featured,
            completed: filters.completed,
        },
    });

    const entries = data?.pages.flatMap((page) => page.data) ?? [];
    const { data: goal } = useGoal({ goalId });

    if (!goal) {
        return <LoadingOverlay />;
    }

    return (
        <main className={styles.container}>
            <GoalPageHeader goalName={goal.name} />

            <div className={styles.wrapper}>
                <GoalCard goal={goal} />

                <GoalEntriesList entries={entries} goalId={goalId}>
                    <EntryFiltersGroup size="1" onFiltersChange={setFilters} />
                </GoalEntriesList>
            </div>
        </main>
    );
};
