import { PropsWithChildren } from "react";
import { OverlayArrow, Tooltip as TooltipPopup, TooltipTrigger } from "react-aria-components";

import styles from "./styles/Tooltip.module.scss";

type TooltipProps = PropsWithChildren<{
    label: string;
}>;

export const Tooltip = ({ children, label }: TooltipProps) => {
    return (
        <TooltipTrigger delay={0} closeDelay={0}>
            {children}
            <TooltipPopup offset={10} crossOffset={10} placement="top" className={styles.tooltipPopup}>
                <OverlayArrow>
                    <svg width={8} height={8} viewBox="0 0 8 8">
                        <path d="M0 0 L4 4 L8 0" />
                    </svg>
                </OverlayArrow>
                {label}
            </TooltipPopup>
        </TooltipTrigger>
    );
};
