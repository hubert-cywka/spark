import { CardProps } from "./types/Card";

import styles from "./styles/Card.module.scss";

export const Card = ({ children, size = "2" }: CardProps) => {
    return (
        <div data-size={size} className={styles.container}>
            {children}
        </div>
    );
};
