import { Pencil } from "lucide-react";

import { IconButton } from "@/components/IconButton";
import { PassiveTextInputPassiveModeActionsRenderProps } from "@/components/PassiveTextInput";

export const AlertTimeInputPassiveModeActionsRender = ({ onStartEditMode }: PassiveTextInputPassiveModeActionsRenderProps) => {
    return <IconButton variant="secondary" size="1" onPress={onStartEditMode} iconSlot={Pencil} />;
};
