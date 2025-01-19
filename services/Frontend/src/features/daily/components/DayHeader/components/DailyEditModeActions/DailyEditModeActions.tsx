import { Check, X } from "lucide-react";

import { IconButton } from "@/components/IconButton";

type DailyEditModeActionsProps = {
    onCancel: () => void;
    onSave: () => void;
    isSaveDisabled: boolean;
};

export const DailyEditModeActions = ({ onCancel, isSaveDisabled, onSave }: DailyEditModeActionsProps) => {
    return (
        <>
            <IconButton variant="secondary" size="1" onPress={onCancel} iconSlot={X} />
            <IconButton size="1" variant="confirm" onPress={onSave} isDisabled={isSaveDisabled} iconSlot={Check} />
        </>
    );
};
