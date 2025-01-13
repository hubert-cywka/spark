import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus } from "lucide-react";

import styles from "./styles/DailyListHeader.module.scss";

import { IconButton } from "@/components/IconButton";

type DailyListHeaderProps = {
    timeframeStart: Date;
    onReset: () => void;
    onNextTimeframe: (units: number) => void;
    onPrevTimeframe: (units: number) => void;
    onCreateNewDaily: () => void;
};

export const DailyListHeader = ({ timeframeStart, onNextTimeframe, onPrevTimeframe, onReset, onCreateNewDaily }: DailyListHeaderProps) => {
    const now = new Date();
    const isCurrentYearAndMonth = now.getMonth() === timeframeStart.getMonth() && now.getFullYear() === timeframeStart.getFullYear();

    return (
        <div className={styles.headerWrapper}>
            <div className={styles.buttons}>
                <IconButton onPress={onCreateNewDaily} variant="confirm">
                    <Plus />
                </IconButton>
                <IconButton isDisabled={isCurrentYearAndMonth} onPress={onReset} variant="secondary">
                    <Calendar />
                </IconButton>

                <IconButton variant="secondary" onPress={() => onPrevTimeframe(12)} className={styles.changeYearButton}>
                    <ChevronsLeft />
                </IconButton>
                <IconButton variant="secondary" onPress={() => onPrevTimeframe(1)}>
                    <ChevronLeft />
                </IconButton>
                <IconButton variant="secondary" onPress={() => onNextTimeframe(1)}>
                    <ChevronRight />
                </IconButton>
                <IconButton variant="secondary" onPress={() => onNextTimeframe(12)} className={styles.changeYearButton}>
                    <ChevronsRight />
                </IconButton>
            </div>

            <h1 className={styles.header}>
                {/* TODO: Locale */}
                {timeframeStart.getFullYear()}, {timeframeStart.toLocaleString("en", { month: "long" })}
            </h1>
        </div>
    );
};
