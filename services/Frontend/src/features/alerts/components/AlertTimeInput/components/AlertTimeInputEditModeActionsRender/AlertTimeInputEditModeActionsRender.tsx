import { Check, X } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputEditModeActionsRenderProps } from "@/components/PassiveTextInput";

export const AlertTimeInputEditModeActionsRender = ({
    onCancelEditMode,
    onSaveChanges,
    hasValueChanged,
    translationFn,
}: PassiveTextInputEditModeActionsRenderProps) => {
    return (
        <>
            <IconButton
                variant="secondary"
                size="1"
                onPress={onCancelEditMode}
                iconSlot={X}
                tooltip={translationFn("alerts.reminders.cancelChangesButton.label")}
                aria-label={translationFn("alerts.reminders.cancelChangesButton.label")}
            />
            <IconButton
                size="1"
                variant="confirm"
                onPress={onSaveChanges}
                isDisabled={!hasValueChanged}
                iconSlot={Check}
                tooltip={translationFn("alerts.reminders.confirmChangesButton.label")}
                aria-label={translationFn("alerts.reminders.confirmChangesButton.label")}
            />
        </>
    );
};
