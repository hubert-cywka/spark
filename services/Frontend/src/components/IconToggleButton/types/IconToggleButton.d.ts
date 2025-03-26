import { IconSlot } from "@/components/Icon/types/Icon";
import { ToggleButtonProps } from "@/components/ToggleButton/types/ToggleButton";

export type IconToggleButtonProps = Omit<ToggleButtonProps, "leftDecorator" | "rightDecorator" | "children"> & {
    iconSlot: IconSlot;
    tooltip?: string;
};
