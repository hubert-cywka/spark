"use client";

import styles from "./styles/GoalsList.module.scss";

import { ItemLoader } from "@/components/ItemLoader/ItemLoader";
import { GoalCard } from "@/features/goals/components/GoalCard/GoalCard";
import { GoalCardSkeleton } from "@/features/goals/components/GoalCard/GoalCardSkeleton";
import { useGoals } from "@/features/goals/hooks/useGoals";

// TODO: Clean up
// TODO: Handle empty state, handle error state
export const GoalsList = () => {
    const { data, fetchNextPage, isFetching, hasNextPage } = useGoals();

    return (
        <div className={styles.list}>
            {data?.pages?.map((page) => page.data.map((goal) => <GoalCard key={goal.id} goal={goal} />))}

            <ItemLoader shouldLoadNext={hasNextPage} onLoadNext={fetchNextPage}>
                {isFetching && <GoalCardSkeleton count={3} />}
            </ItemLoader>
        </div>
    );
};
