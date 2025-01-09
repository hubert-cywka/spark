"use client";

import styles from "./styles/AddGoalPanel.module.scss";

import { Card } from "@/components/Card";
import { AddGoalForm } from "@/features/goals/components/AddGoalForm/AddGoalForm";
import { AddGoalFormInputs } from "@/features/goals/components/AddGoalForm/hooks/useAddGoalForm";
import { useCreateGoal } from "@/features/goals/hooks/create/useCreateGoal";
import { useCreateGoalEvents } from "@/features/goals/hooks/create/useCreateGoalEvents";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

export const AddGoalPanel = () => {
    const t = useTranslate();
    const { mutateAsync: createGoal, isPending } = useCreateGoal();
    const { onCreateGoalError, onCreateGoalSuccess } = useCreateGoalEvents();

    const onSubmit = async ({ deadline, name, target }: AddGoalFormInputs) => {
        try {
            await createGoal({
                deadline: deadline ? deadline : null,
                name,
                target,
            });
            onCreateGoalSuccess();
        } catch (err) {
            onCreateGoalError(err);
        }
    };

    return (
        <Card className={styles.panel} variant="semi-translucent">
            <p className={styles.header}>{t("goals.management.add.header")}</p>
            <AddGoalForm onSubmit={onSubmit} isLoading={isPending} />
        </Card>
    );
};
