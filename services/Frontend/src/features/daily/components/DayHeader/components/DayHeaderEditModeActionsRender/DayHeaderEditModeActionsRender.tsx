import { Check, X } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputEditModeActionsRenderProps } from "@/components/PassiveTextInput";

export const DayHeaderEditModeActionsRender = ({
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
                tooltip={translationFn("daily.day.actions.cancel.label")}
                aria-label={translationFn("daily.day.actions.cancel.label")}
            />
            <IconButton
                size="1"
                variant="confirm"
                onPress={onSaveChanges}
                isDisabled={!hasValueChanged}
                iconSlot={Check}
                tooltip={translationFn("daily.day.actions.save.label")}
                aria-label={translationFn("daily.day.actions.save.label")}
            />
        </>
    );
};
