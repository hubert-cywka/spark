import classNames from "clsx";

import { CardProps } from "./types/Card";

import styles from "./styles/Card.module.scss";

export const Card = ({ children, className, onClick, size = "2" }: CardProps) => {
    return (
        <div onClick={onClick} data-size={size} className={classNames(styles.container, className)}>
            {children}
        </div>
    );
};
