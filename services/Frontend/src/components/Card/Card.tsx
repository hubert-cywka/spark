import classNames from "clsx";

import { CardProps } from "./types/Card";

import styles from "./styles/Card.module.scss";

export const Card = ({ children, className, size = "2", variant = "solid", ...rest }: CardProps) => {
    return (
        <div data-size={size} data-variant={variant} className={classNames(styles.container, className)} {...rest}>
            {children}
        </div>
    );
};
