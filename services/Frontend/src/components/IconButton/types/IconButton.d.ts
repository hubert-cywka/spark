import { ButtonProps } from "@/components/Button";
import { IconSlot } from "@/components/Icon/Icon";

export type IconButtonProps = Omit<ButtonProps, "children"> & {
    iconSlot: IconSlot;
    ["aria-label"]: string;
    tooltip?: string;
    tooltipDelay?: number;
};
