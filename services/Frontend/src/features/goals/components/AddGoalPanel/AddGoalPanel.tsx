"use client";

import styles from "./styles/AddGoalPanel.module.scss";

import { Card } from "@/components/Card";
import { AddGoalForm } from "@/features/goals/components/AddGoalForm/AddGoalForm";
import { AddGoalFormInputs } from "@/features/goals/components/AddGoalForm/hooks/useAddGoalForm";
import { useCreateGoal } from "@/features/goals/hooks/useCreateGoal";

export const AddGoalPanel = () => {
    const { mutateAsync: createGoal, isPending } = useCreateGoal();

    const onSubmit = async ({ deadline, name, target }: AddGoalFormInputs) => {
        await createGoal({
            deadline: deadline ? deadline.toLocaleDateString() : null,
            name,
            target,
        });
    };

    return (
        <Card className={styles.panel}>
            <p className={styles.header}>Add new goal</p>
            <AddGoalForm onSubmit={onSubmit} isLoading={isPending} />
        </Card>
    );
};
