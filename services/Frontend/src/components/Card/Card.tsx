import { forwardRef } from "react";
import classNames from "clsx";

import { CardProps } from "./types/Card";

import styles from "./styles/Card.module.scss";

export const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className, size = "2", variant = "solid", ...rest }, ref) => {
    return (
        <div ref={ref} data-size={size} data-variant={variant} className={classNames(styles.container, className)} {...rest}>
            {children}
        </div>
    );
});

Card.displayName = "Card";
