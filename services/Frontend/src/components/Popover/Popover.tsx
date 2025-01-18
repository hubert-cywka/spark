import { PropsWithChildren, ReactNode } from "react";
import { Dialog, DialogTrigger, OverlayArrow, Popover as BasePopover, PopoverProps as BasePopoverProps } from "react-aria-components";

import styles from "./styles/Popover.module.scss";

type PopoverProps = Omit<BasePopoverProps, "trigger"> & PropsWithChildren<{ trigger: ReactNode }>;

// TODO: Style + fix arrow
export const Popover = ({ children, trigger, ...rest }: PopoverProps) => {
    return (
        <DialogTrigger>
            {trigger}
            <BasePopover {...rest}>
                <OverlayArrow>
                    <svg width={12} height={12} viewBox="0 0 12 12">
                        <path d="M0 0 L6 6 L12 0" />
                    </svg>
                </OverlayArrow>
                <Dialog className={styles.dialog}>{children}</Dialog>
            </BasePopover>
        </DialogTrigger>
    );
};
