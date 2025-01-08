"use client";

import styles from "./styles/AddGoalPanel.module.scss";

import { Card } from "@/components/Card";
import { AddGoalForm } from "@/features/goals/components/AddGoalForm/AddGoalForm";
import { AddGoalFormInputs } from "@/features/goals/components/AddGoalForm/hooks/useAddGoalForm";
import { useCreateGoal } from "@/features/goals/hooks/useCreateGoal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const AddGoalPanel = () => {
    const t = useTranslate();
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
            <p className={styles.header}>{t("goals.management.add.header")}</p>
            <AddGoalForm onSubmit={onSubmit} isLoading={isPending} />
        </Card>
    );
};
