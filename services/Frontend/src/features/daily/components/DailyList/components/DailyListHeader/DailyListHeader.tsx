import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RotateCcw } from "lucide-react";

import styles from "./styles/DailyListHeader.module.scss";

import { IconButton } from "@/components/IconButton";

type DailyListHeaderProps = {
    timeframeStart: Date;
    onReset: () => void;
    onNextTimeframe: (units: number) => void;
    onPrevTimeframe: (units: number) => void;
};

export const DailyListHeader = ({ timeframeStart, onNextTimeframe, onPrevTimeframe, onReset }: DailyListHeaderProps) => {
    const now = new Date();
    const isCurrentYearAndMonth = now.getMonth() === timeframeStart.getMonth() && now.getFullYear() === timeframeStart.getFullYear();

    return (
        <div className={styles.headerWrapper}>
            <div className={styles.buttons}>
                <IconButton isDisabled={isCurrentYearAndMonth} onPress={onReset} variant="secondary" size="3">
                    <RotateCcw />
                </IconButton>

                <IconButton variant="secondary" onPress={() => onPrevTimeframe(12)} size="3">
                    <ChevronsLeft />
                </IconButton>
                <IconButton variant="secondary" onPress={() => onPrevTimeframe(1)} size="3">
                    <ChevronLeft />
                </IconButton>
                <IconButton variant="secondary" onPress={() => onNextTimeframe(1)} size="3">
                    <ChevronRight />
                </IconButton>
                <IconButton variant="secondary" onPress={() => onNextTimeframe(12)} size="3">
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
