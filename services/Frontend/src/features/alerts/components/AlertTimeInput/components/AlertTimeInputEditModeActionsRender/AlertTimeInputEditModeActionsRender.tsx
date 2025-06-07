import { Check, X } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputEditModeActionsRenderProps } from "@/components/PassiveTextInput";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const AlertTimeInputEditModeActionsRender = ({
    onCancelEditMode,
    onSaveChanges,
    hasValueChanged,
}: PassiveTextInputEditModeActionsRenderProps) => {
    const t = useTranslate();

    return (
        <>
            <IconButton
                variant="secondary"
                size="1"
                onPress={onCancelEditMode}
                iconSlot={X}
                tooltip={t("alerts.reminders.cancelChangesButton.label")}
                aria-label={t("alerts.reminders.cancelChangesButton.label")}
            />
            <IconButton
                size="1"
                variant="confirm"
                onPress={onSaveChanges}
                isDisabled={!hasValueChanged}
                iconSlot={Check}
                tooltip={t("alerts.reminders.confirmChangesButton.label")}
                aria-label={t("alerts.reminders.confirmChangesButton.label")}
            />
        </>
    );
};
