"use client";

import { useState } from "react";

import { Modal, ModalHeader } from "@/components/Modal";
import { ModalTrigger } from "@/components/Modal/types/Modal";
import { AddGoalForm } from "@/features/goals/components/AddGoalForm";
import { AddGoalFormInputs } from "@/features/goals/components/AddGoalForm/hooks/useAddGoalForm";
import { useUpdateGoal } from "@/features/goals/hooks/update/useUpdateGoal";
import { useUpdateGoalEvents } from "@/features/goals/hooks/update/useUpdateGoalEvents";
import { Goal } from "@/features/goals/types/Goal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type EditGoalModalProps = {
    goal: Goal;
    trigger: ModalTrigger;
};

export const EditGoalModal = ({ goal, trigger }: EditGoalModalProps) => {
    const t = useTranslate();
    const [isOpen, setIsOpen] = useState(false);

    const { mutateAsync: updateGoal } = useUpdateGoal();
    const { onUpdateGoalError, onUpdateGoalSuccess } = useUpdateGoalEvents();

    const handleUpdateGoal = async ({ deadline, name, target }: AddGoalFormInputs) => {
        try {
            await updateGoal({
                id: goal.id,
                deadline: deadline?.toISOString() ?? null,
                name,
                target,
            });
            onUpdateGoalSuccess();
            close();
        } catch (err) {
            onUpdateGoalError(err);
        }
    };

    const close = () => {
        setIsOpen(false);
    };

    return (
        <Modal trigger={trigger({ onClick: () => setIsOpen(true) })} isOpen={isOpen} onOpenChange={setIsOpen}>
            <ModalHeader onClose={close}>{t("goals.management.edit.header")}</ModalHeader>
            <AddGoalForm onSubmit={handleUpdateGoal} initialValue={mapGoalToFormInitialValues(goal)} onReset={close} />
        </Modal>
    );
};

const mapGoalToFormInitialValues = ({ deadline, name, target }: Goal) => {
    return {
        deadline: deadline ?? undefined,
        name,
        target,
    };
};
