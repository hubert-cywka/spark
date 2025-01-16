import { Check, X } from "lucide-react";

import { Icon } from "@/components/Icon";
import { IconButton } from "@/components/IconButton";

type DailyEditModeActionsProps = {
    onCancel: () => void;
    onSave: () => void;
    isSaveDisabled: boolean;
};

export const DailyEditModeActions = ({ onCancel, isSaveDisabled, onSave }: DailyEditModeActionsProps) => {
    return (
        <>
            <IconButton variant="secondary" size="1" onPress={onCancel}>
                <Icon slot={X} />
            </IconButton>
            <IconButton size="1" variant="confirm" onPress={onSave} isDisabled={isSaveDisabled}>
                <Icon slot={Check} />
            </IconButton>
        </>
    );
};
