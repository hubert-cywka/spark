import classNames from "clsx";

import { CardProps } from "./types/Card";

import styles from "./styles/Card.module.scss";

export const Card = ({ children, className, size = "2" }: CardProps) => {
    return (
        <div data-size={size} className={classNames(styles.container, className)}>
            {children}
        </div>
    );
};
