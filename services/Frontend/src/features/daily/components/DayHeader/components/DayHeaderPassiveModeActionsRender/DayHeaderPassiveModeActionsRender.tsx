import { Pencil, Trash } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputPassiveModeActionsRenderProps } from "@/components/PassiveTextInput";
import { DeleteDailyModal } from "@/features/daily/components/DeleteDailyModal/DeleteDailyModal";
import { Daily } from "@/features/daily/types/Daily";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DayHeaderPassiveModeActionsRenderProps = {
    daily: Daily;
} & PassiveTextInputPassiveModeActionsRenderProps;

export const DayHeaderPassiveModeActionsRender = ({ daily, onStartEditMode }: DayHeaderPassiveModeActionsRenderProps) => {
    const t = useTranslate();

    return (
        <>
            <IconButton
                variant="secondary"
                size="1"
                onPress={onStartEditMode}
                iconSlot={Pencil}
                tooltip={t("daily.day.actions.edit.label")}
                aria-label={t("daily.day.actions.edit.label")}
            />
            <DeleteDailyModal
                daily={daily}
                trigger={({ onClick }) => (
                    <IconButton
                        variant="danger"
                        size="1"
                        onPress={onClick}
                        iconSlot={Trash}
                        tooltip={t("daily.day.actions.delete.label")}
                        aria-label={t("daily.day.actions.delete.label")}
                    />
                )}
            />
        </>
    );
};
