import classNames from "clsx";

import styles from "./styles/Container.module.scss";

import { ContainerProps } from "@/components/Container/types/Container";

export const Container = ({ children, className, size = "5" }: ContainerProps) => {
    return (
        <div className={classNames(styles.container, className)} data-size={size}>
            {children}
        </div>
    );
};
