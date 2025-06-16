import { Pencil, Trash } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputPassiveModeActionsRenderProps } from "@/components/PassiveTextInput";
import { DeleteDailyModal } from "@/features/daily/components/DeleteDailyModal/DeleteDailyModal";
import { Daily } from "@/features/daily/types/Daily";

type DayHeaderPassiveModeActionsRenderProps = {
    daily: Daily;
} & PassiveTextInputPassiveModeActionsRenderProps;

export const DayHeaderPassiveModeActionsRender = ({ daily, onStartEditMode, translationFn }: DayHeaderPassiveModeActionsRenderProps) => {
    return (
        <>
            <IconButton
                variant="secondary"
                size="1"
                onPress={onStartEditMode}
                iconSlot={Pencil}
                tooltip={translationFn("daily.day.actions.edit.label")}
                aria-label={translationFn("daily.day.actions.edit.label")}
            />
            <DeleteDailyModal
                daily={daily}
                trigger={({ onClick }) => (
                    <IconButton
                        variant="danger"
                        size="1"
                        onPress={onClick}
                        iconSlot={Trash}
                        tooltip={translationFn("daily.day.actions.delete.label")}
                        aria-label={translationFn("daily.day.actions.delete.label")}
                    />
                )}
            />
        </>
    );
};
