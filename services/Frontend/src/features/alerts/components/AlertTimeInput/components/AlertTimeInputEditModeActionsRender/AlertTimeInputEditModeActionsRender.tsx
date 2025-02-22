import { Check, X } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputEditModeActionsRenderProps } from "@/components/PassiveTextInput";

export const AlertTimeInputEditModeActionsRender = ({
    onCancelEditMode,
    onSaveChanges,
    hasValueChanged,
}: PassiveTextInputEditModeActionsRenderProps) => {
    return (
        <>
            <IconButton variant="secondary" size="1" onPress={onCancelEditMode} iconSlot={X} />
            <IconButton size="1" variant="confirm" onPress={onSaveChanges} isDisabled={!hasValueChanged} iconSlot={Check} />
        </>
    );
};
