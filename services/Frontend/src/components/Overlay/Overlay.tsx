import { PropsWithChildren } from "react";
import classNames from "clsx";

import styles from "./styles/Overlay.module.scss";

type OverlayProps = PropsWithChildren<{
    variant?: "solid" | "translucent";
}>;

export const Overlay = ({ children, variant = "translucent" }: OverlayProps) => {
    return (
        <div className={classNames(styles.overlay)} data-variant={variant}>
            {children}
        </div>
    );
};
