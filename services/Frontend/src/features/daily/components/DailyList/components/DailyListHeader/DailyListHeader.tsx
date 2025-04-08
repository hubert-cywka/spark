import { PropsWithChildren } from "react";
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus } from "lucide-react";
import { useFormatter } from "next-intl";

import styles from "./styles/DailyListHeader.module.scss";

import { IconButton } from "@/components/IconButton";

const TIMEFRAME_BIG_CHANGE_UNITS = 12;
const TIMEFRAME_SMALL_CHANGE_UNITS = 1;

type DailyListHeaderProps = PropsWithChildren<{
    timeframeStart: Date;
    onReset: () => void;
    onNextTimeframe: (units: number) => void;
    onPrevTimeframe: (units: number) => void;
    onCreateNewDaily: () => void;
}>;

export const DailyListHeader = ({
    timeframeStart,
    onNextTimeframe,
    onPrevTimeframe,
    onReset,
    onCreateNewDaily,
    children,
}: DailyListHeaderProps) => {
    const now = new Date();
    const formatter = useFormatter();
    const isCurrentYearAndMonth = now.getMonth() === timeframeStart.getMonth() && now.getFullYear() === timeframeStart.getFullYear();

    return (
        <header className={styles.headerWrapper}>
            <div className={styles.dateRangeFilters}>
                <div className={styles.buttons}>
                    <IconButton onPress={onCreateNewDaily} variant="confirm" iconSlot={Plus} />
                    <IconButton isDisabled={isCurrentYearAndMonth} onPress={onReset} variant="secondary" iconSlot={Calendar} />

                    <IconButton
                        variant="secondary"
                        onPress={() => onPrevTimeframe(TIMEFRAME_BIG_CHANGE_UNITS)}
                        className={styles.changeYearButton}
                        iconSlot={ChevronsLeft}
                    />
                    <IconButton variant="secondary" onPress={() => onPrevTimeframe(TIMEFRAME_SMALL_CHANGE_UNITS)} iconSlot={ChevronLeft} />
                    <IconButton variant="secondary" onPress={() => onNextTimeframe(TIMEFRAME_SMALL_CHANGE_UNITS)} iconSlot={ChevronRight} />
                    <IconButton
                        variant="secondary"
                        onPress={() => onNextTimeframe(TIMEFRAME_BIG_CHANGE_UNITS)}
                        className={styles.changeYearButton}
                        iconSlot={ChevronsRight}
                    />
                </div>

                <h1 className={styles.header}>
                    {timeframeStart.getFullYear()},{" "}
                    {formatter.dateTime(timeframeStart, {
                        month: "long",
                    })}
                </h1>
            </div>

            {children}
        </header>
    );
};
