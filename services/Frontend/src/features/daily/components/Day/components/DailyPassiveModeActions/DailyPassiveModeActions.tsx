import { Pencil, Trash } from "lucide-react";

import { Icon } from "@/components/Icon";
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
                <Icon slot={Pencil} />
            </IconButton>
            <DeleteDailyModal
                daily={daily}
                trigger={({ onClick }) => (
                    <IconButton variant="danger" size="1" onPress={onClick}>
                        <Icon slot={Trash} />
                    </IconButton>
                )}
            />
        </>
    );
};
