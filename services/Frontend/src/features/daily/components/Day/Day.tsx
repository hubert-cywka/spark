import styles from "./styles/Day.module.scss";

import { DayHeader } from "@/features/daily/components/Day/components/DayHeader/DayHeader";
import { Daily } from "@/features/daily/types/Daily";

type DayProps = {
    daily: Daily;
};

// TODO: Add entries
export const Day = ({ daily }: DayProps) => {
    return (
        <div className={styles.container}>
            <DayHeader daily={daily} />

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
