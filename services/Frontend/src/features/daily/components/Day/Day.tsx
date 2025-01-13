import { PropsWithChildren } from "react";

import styles from "./styles/Day.module.scss";

type DayProps = PropsWithChildren;

// TODO: Add entries
export const Day = ({ children }: DayProps) => {
    return (
        <div className={styles.container}>
            {children}

            <ul>
                <li>Something something</li>
                <li>Something something something something</li>
                <li>Something something something</li>
                <li>Something</li>
                <li>Something something</li>
                <li>Something something something</li>
            </ul>
        </div>
    );
};
