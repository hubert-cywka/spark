import styles from "./styles/Container.module.scss";

import { ContainerProps } from "@/components/Container/types/Container";

export const Container = ({ children, size = "5" }: ContainerProps) => {
    return (
        <div className={styles.container} data-size={size}>
            {children}
        </div>
    );
};
