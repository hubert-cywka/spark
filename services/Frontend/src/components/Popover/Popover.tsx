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
                <OverlayArrow className={styles.arrow}>
                    <svg width={20} height={10} viewBox="0 0 20 10">
                        <path d="M 0 10 L 10 0 L 20 10" />
                    </svg>
                </OverlayArrow>
                <Dialog className={styles.dialog}>{children}</Dialog>
            </BasePopover>
        </DialogTrigger>
    );
};
