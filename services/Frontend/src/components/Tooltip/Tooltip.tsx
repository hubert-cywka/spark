import { OverlayArrow, Tooltip as TooltipPopup, TooltipTrigger } from "react-aria-components";

import { TooltipProps } from "./types/Tooltip";

import styles from "./styles/Tooltip.module.scss";

export const Tooltip = ({ children, label }: TooltipProps) => {
    if (!label) {
        return <>{children}</>;
    }

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
