import { Children, PropsWithChildren } from "react";

import styles from "./styles/Day.module.scss";

import { DayHeader } from "@/features/daily/components/Day/components/DayHeader/DayHeader";
import { Daily } from "@/features/daily/types/Daily";

type DayProps = PropsWithChildren<{ daily: Daily }>;

export const Day = ({ children, daily }: DayProps) => {
    const entriesCount = Children.count(children);

    return (
        <div className={styles.container}>
            <DayHeader daily={daily} />
            {!!entriesCount && <ul className={styles.entries}>{children}</ul>}
        </div>
    );
};
