import { Pencil } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputPassiveModeActionsRenderProps } from "@/components/PassiveTextInput";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

export const AlertTimeInputPassiveModeActionsRender = ({ onStartEditMode }: PassiveTextInputPassiveModeActionsRenderProps) => {
    const t = useTranslate();

    return (
        <IconButton
            variant="secondary"
            size="1"
            onPress={onStartEditMode}
            iconSlot={Pencil}
            tooltip={t("alerts.reminders.editButton.label")}
            aria-label={t("alerts.reminders.editButton.label")}
        />
    );
};
