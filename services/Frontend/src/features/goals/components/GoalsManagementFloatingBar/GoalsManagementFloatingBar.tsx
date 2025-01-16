"use client";

import { Pencil, Trash, X } from "lucide-react";

import styles from "./styles/GoalsManagementFloatingBar.module.scss";

import { Icon } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";
import { EditGoalModal } from "@/features/goals/components/EditGoalModal/EditGoalModal";
import { useDeleteGoal } from "@/features/goals/hooks/delete/useDeleteGoal";
import { useDeleteGoalEvents } from "@/features/goals/hooks/delete/useDeleteGoalEvents";
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
                <IconButton variant="subtle" onPress={onClose} size="1" className={styles.closeButton}>
                    <Icon slot={X} />
                </IconButton>
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
                        >
                            <Icon slot={Pencil} />
                        </IconButton>
                    )}
                />

                <IconButton
                    variant="subtle"
                    onPress={handleDeleteGoal}
                    size="1"
                    aria-label={t("goals.management.floatingBar.buttons.delete.label")}
                >
                    <Icon slot={Trash} />
                </IconButton>
            </div>
        </div>
    );
};
