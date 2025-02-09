"use client";

import { useCallback, useState } from "react";

import styles from "./styles/GoalsDashboard.module.scss";

import { Field } from "@/components/Input";
import { ItemLoader } from "@/components/ItemLoader/ItemLoader";
import { GoalCardSkeleton } from "@/features/goals/components/GoalCard/GoalCardSkeleton";
import { GoalsList } from "@/features/goals/components/GoalsList";
import { GoalsManagementFloatingBar } from "@/features/goals/components/GoalsManagementFloatingBar/GoalsManagementFloatingBar";
import { useGoals } from "@/features/goals/hooks/useGoals/useGoals";
import useDebounce from "@/hooks/useDebounce";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const SEARCH_DEBOUNCE_IN_MS = 350;

export const GoalsDashboard = () => {
    const t = useTranslate();

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useDebounce(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_IN_MS, [search]);

    const { data, fetchNextPage, isFetching, hasNextPage } = useGoals({
        name: debouncedSearch,
        withProgress: true,
    });
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

    const goals = data?.pages?.flatMap(({ data }) => data) ?? [];
    const accomplishedGoals = goals.filter((goal) => !!goal.isAccomplished);
    const pendingGoals = goals.filter((goal) => !goal.isAccomplished);
    const selectedGoal = goals.find((goal) => selectedGoalId === goal.id);

    const clearSelection = useCallback(() => {
        setSelectedGoalId(null);
    }, []);

    useKeyboardShortcut({ callback: clearSelection, keys: ["Escape"] });

    return (
        <div className={styles.container}>
            <Field
                value={search}
                onChange={setSearch}
                className={styles.searchBar}
                placeholder={t("goals.list.search.placeholder")}
                size="3"
            />

            <GoalsList
                header={t("goals.list.section.accomplished.header", {
                    count: accomplishedGoals.length,
                })}
                goals={accomplishedGoals}
                onSelectGoal={setSelectedGoalId}
                selectedGoalId={selectedGoalId}
            />

            <GoalsList
                header={t("goals.list.section.pending.header", {
                    count: pendingGoals.length,
                })}
                goals={pendingGoals}
                onSelectGoal={setSelectedGoalId}
                selectedGoalId={selectedGoalId}
            />

            <ItemLoader shouldLoadNext={hasNextPage} onLoadNext={fetchNextPage} isLoaderVisible={isFetching}>
                <GoalCardSkeleton count={1} />
            </ItemLoader>

            {selectedGoal && <GoalsManagementFloatingBar selectedGoal={selectedGoal} onClose={clearSelection} />}
        </div>
    );
};
