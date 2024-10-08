import { PropsWithChildren } from "react";
import { OverlayArrow, TooltipTrigger } from "react-aria-components";

import { TooltipStyled } from "@/components/tooltip/styles/Tooltip.styled";

type TooltipProps = PropsWithChildren<{
    label: string;
}>;

export const Tooltip = ({ children, label }: TooltipProps) => {
    return (
        <TooltipTrigger delay={0} closeDelay={0}>
            {children}
            <TooltipStyled.Popup offset={10} crossOffset={10} placement="top">
                <OverlayArrow>
                    <svg width={8} height={8} viewBox="0 0 8 8">
                        <path d="M0 0 L4 4 L8 0" />
                    </svg>
                </OverlayArrow>
                {label}
            </TooltipStyled.Popup>
        </TooltipTrigger>
    );
};
