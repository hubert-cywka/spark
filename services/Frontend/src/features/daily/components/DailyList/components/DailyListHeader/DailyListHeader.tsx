import { PropsWithChildren } from "react";
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus } from "lucide-react";
import { useLocale } from "next-intl";

import styles from "./styles/DailyListHeader.module.scss";

import { IconButton } from "@/components/IconButton";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

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
    const t = useTranslate();

    const now = new Date();
    const locale = useLocale();
    const isCurrentYearAndMonth = now.getMonth() === timeframeStart.getMonth() && now.getFullYear() === timeframeStart.getFullYear();

    return (
        <header className={styles.headerWrapper}>
            <div className={styles.dateRangeFilters}>
                <div className={styles.buttons}>
                    <IconButton
                        onPress={onCreateNewDaily}
                        variant="confirm"
                        iconSlot={Plus}
                        tooltip={t("daily.createDailyButton.label")}
                        aria-label={t("daily.createDailyButton.label")}
                    />
                    <IconButton
                        isDisabled={isCurrentYearAndMonth}
                        onPress={onReset}
                        variant="secondary"
                        iconSlot={Calendar}
                        tooltip={t("daily.filters.today")}
                        aria-label={t("daily.filters.today")}
                    />

                    <IconButton
                        variant="secondary"
                        onPress={() => onPrevTimeframe(TIMEFRAME_BIG_CHANGE_UNITS)}
                        className={styles.changeYearButton}
                        iconSlot={ChevronsLeft}
                        tooltip={t("daily.filters.previousYear")}
                        aria-label={t("daily.filters.previousYear")}
                    />
                    <IconButton
                        variant="secondary"
                        onPress={() => onPrevTimeframe(TIMEFRAME_SMALL_CHANGE_UNITS)}
                        iconSlot={ChevronLeft}
                        tooltip={t("daily.filters.previousMonth")}
                        aria-label={t("daily.filters.previousMonth")}
                    />
                    <IconButton
                        variant="secondary"
                        onPress={() => onNextTimeframe(TIMEFRAME_SMALL_CHANGE_UNITS)}
                        iconSlot={ChevronRight}
                        tooltip={t("daily.filters.nextMonth")}
                        aria-label={t("daily.filters.nextMonth")}
                    />
                    <IconButton
                        variant="secondary"
                        onPress={() => onNextTimeframe(TIMEFRAME_BIG_CHANGE_UNITS)}
                        className={styles.changeYearButton}
                        iconSlot={ChevronsRight}
                        tooltip={t("daily.filters.nextYear")}
                        aria-label={t("daily.filters.nextYear")}
                    />
                </div>

                <h1 className={styles.header}>
                    {timeframeStart.toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                    })}
                </h1>
            </div>

            {children}
        </header>
    );
};
