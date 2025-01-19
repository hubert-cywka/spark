import { PropsWithChildren } from "react";
import classNames from "clsx";

import styles from "./styles/DailyEntryWrapper.module.scss";

type DailyEntryWrapperProps = PropsWithChildren<{ id: string }>;

export const DailyEntryWrapper = ({ children, id }: DailyEntryWrapperProps) => {
    return (
        <li id={id} className={classNames(styles.container)}>
            {children}
        </li>
    );
};
