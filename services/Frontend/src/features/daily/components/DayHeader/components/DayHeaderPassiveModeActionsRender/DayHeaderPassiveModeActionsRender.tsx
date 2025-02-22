import { Pencil, Trash } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputPassiveModeActionsRenderProps } from "@/components/PassiveTextInput";
import { DeleteDailyModal } from "@/features/daily/components/DeleteDailyModal/DeleteDailyModal";
import { Daily } from "@/features/daily/types/Daily";

type DayHeaderPassiveModeActionsRenderProps = {
    daily: Daily;
} & PassiveTextInputPassiveModeActionsRenderProps;

export const DayHeaderPassiveModeActionsRender = ({ daily, onStartEditMode }: DayHeaderPassiveModeActionsRenderProps) => {
    return (
        <>
            <IconButton variant="secondary" size="1" onPress={onStartEditMode} iconSlot={Pencil} />
            <DeleteDailyModal
                daily={daily}
                trigger={({ onClick }) => <IconButton variant="danger" size="1" onPress={onClick} iconSlot={Trash} />}
            />
        </>
    );
};
