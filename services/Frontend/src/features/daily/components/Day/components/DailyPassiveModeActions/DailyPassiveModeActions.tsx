import { Pencil, Trash } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { DeleteDailyModal } from "@/features/daily/components/DeleteDailyModal/DeleteDailyModal";
import { Daily } from "@/features/daily/types/Daily";

type DailyPassiveModeActionsProps = {
    onStartEditMode: () => void;
    daily: Daily;
};

export const DailyPassiveModeActions = ({ daily, onStartEditMode }: DailyPassiveModeActionsProps) => {
    return (
        <>
            <IconButton variant="secondary" size="1" onPress={onStartEditMode}>
                <Pencil />
            </IconButton>
            <DeleteDailyModal
                daily={daily}
                trigger={({ onClick }) => (
                    <IconButton variant="danger" size="1" onPress={onClick}>
                        <Trash />
                    </IconButton>
                )}
            />
        </>
    );
};
