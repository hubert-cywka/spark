import styles from "./styles/Card.module.scss";

import { CardProps } from "@/components/card/types/Card";

export const Card = ({ children, size = "2" }: CardProps) => {
    return (
        <div data-size={size} className={styles.container}>
            {children}
        </div>
    );
};
