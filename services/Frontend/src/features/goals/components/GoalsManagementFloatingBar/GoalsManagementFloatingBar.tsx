"use client";

import { Pencil, Trash, X } from "lucide-react";

import styles from "./styles/GoalsManagementFloatingBar.module.scss";

import { IconButton } from "@/components/IconButton";
import { EditGoalModal } from "@/features/goals/components/EditGoalModal/EditGoalModal";
import { useDeleteGoal } from "@/features/goals/hooks/useDeleteGoal";
import { useDeleteGoalEvents } from "@/features/goals/hooks/useDeleteGoalEvents";
import { Goal } from "@/features/goals/types/Goal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type GoalsManagementFloatingBar = {
    onClose: () => unknown;
    selectedGoal: Goal | null;
};

export const GoalsManagementFloatingBar = ({ onClose, selectedGoal }: GoalsManagementFloatingBar) => {
    const t = useTranslate();
    const { mutateAsync: deleteGoal } = useDeleteGoal();
    const { onDeleteGoalError, onDeleteGoalSuccess } = useDeleteGoalEvents();

    const handleDeleteGoal = async () => {
        if (!selectedGoal) {
            return;
        }

        try {
            await deleteGoal(selectedGoal.id);
            onDeleteGoalSuccess();
            onClose();
        } catch (err) {
            onDeleteGoalError(err);
        }
    };

    if (!selectedGoal) {
        return;
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <IconButton
                    variant="subtle"
                    onPress={onClose}
                    size="1"
                    className={styles.closeButton}
                    iconSlot={X}
                    tooltip={t("goals.management.floatingBar.buttons.close.label")}
                    aria-label={t("goals.management.floatingBar.buttons.close.label")}
                />
                <div>
                    <p className={styles.label}>{t("goals.management.floatingBar.label")}</p>
                    <p className={styles.goalName}>{selectedGoal.name}</p>
                </div>
            </div>

            <div className={styles.actionButtons}>
                <EditGoalModal
                    goal={selectedGoal}
                    trigger={(triggerProps) => (
                        <IconButton
                            variant="subtle"
                            size="1"
                            {...triggerProps}
                            aria-label={t("goals.management.floatingBar.buttons.edit.label")}
                            tooltip={t("goals.management.floatingBar.buttons.edit.label")}
                            iconSlot={Pencil}
                        />
                    )}
                />

                <IconButton
                    variant="subtle"
                    onPress={handleDeleteGoal}
                    size="1"
                    aria-label={t("goals.management.floatingBar.buttons.delete.label")}
                    tooltip={t("goals.management.floatingBar.buttons.delete.label")}
                    iconSlot={Trash}
                />
            </div>
        </div>
    );
};
