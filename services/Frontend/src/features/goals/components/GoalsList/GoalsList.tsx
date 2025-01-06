"use client";

import { useGoals } from "@/features/goals/hooks/useGoals";

// TODO: Structure and style
export const GoalsList = () => {
    const { data } = useGoals();

    return <div>{data?.pages?.map((page) => page.data.map((goal) => goal.name))}</div>;
};
