import { PropsWithChildren } from "react";
import classNames from "clsx";

import styles from "./styles/Section.module.scss";

type SectionTitleProps = PropsWithChildren<{
    className?: string;
}>;

export const Section = ({ children }: PropsWithChildren) => {
    return <div className={styles.section}>{children}</div>;
};

export const SectionTitle = ({ children, className }: SectionTitleProps) => {
    return <h2 className={classNames(styles.title, className)}>{children}</h2>;
};

export const SectionDescription = ({ children }: PropsWithChildren) => {
    return <p className={styles.description}>{children}</p>;
};
