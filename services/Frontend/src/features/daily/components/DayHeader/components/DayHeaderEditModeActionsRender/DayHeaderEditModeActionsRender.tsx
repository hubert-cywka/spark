import { Check, X } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputEditModeActionsRenderProps } from "@/components/PassiveTextInput";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const DayHeaderEditModeActionsRender = ({
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
                tooltip={t("daily.day.actions.cancel.label")}
                aria-label={t("daily.day.actions.cancel.label")}
            />
            <IconButton
                size="1"
                variant="confirm"
                onPress={onSaveChanges}
                isDisabled={!hasValueChanged}
                iconSlot={Check}
                tooltip={t("daily.day.actions.confirm.label")}
                aria-label={t("daily.day.actions.confirm.label")}
            />
        </>
    );
};
