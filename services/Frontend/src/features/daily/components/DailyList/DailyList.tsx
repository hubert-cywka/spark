"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RotateCcw } from "lucide-react";

import styles from "./styles/DailyList.module.scss";

import { IconButton } from "@/components/IconButton";
import { ItemLoader } from "@/components/ItemLoader/ItemLoader";
import { useDailyDateRange } from "@/features/daily/components/DailyList/hooks/useDailyDateRange";
import { Day } from "@/features/daily/components/Day/Day";
import { useDailies } from "@/features/daily/hooks/useDailies";
import { getFormattedDailyDate } from "@/features/daily/utils/dateUtils";

// TODO: Clean up
export const DailyList = () => {
    const { setPrev, setNext, reset, endDate, startDate } = useDailyDateRange({ granularity: "month" });
    const isCurrentYearAndMonth = new Date().getMonth() === startDate.getMonth() && new Date().getFullYear() === startDate.getFullYear();

    const { data, hasNextPage, fetchNextPage, isFetching } = useDailies({
        from: getFormattedDailyDate(startDate),
        to: getFormattedDailyDate(endDate),
    });
    const dailies = data?.pages?.flatMap((page) => page.data) ?? [];

    return (
        <main className={styles.container}>
            <div className={styles.headerWrapper}>
                <div className={styles.buttons}>
                    <IconButton isDisabled={isCurrentYearAndMonth} onPress={reset} variant="secondary" size="3">
                        <RotateCcw />
                    </IconButton>

                    <IconButton variant="secondary" onPress={() => setPrev(12)} size="3">
                        <ChevronsLeft />
                    </IconButton>
                    <IconButton variant="secondary" onPress={() => setPrev(1)} size="3">
                        <ChevronLeft />
                    </IconButton>
                    <IconButton variant="secondary" onPress={() => setNext(1)} size="3">
                        <ChevronRight />
                    </IconButton>
                    <IconButton variant="secondary" onPress={() => setNext(12)} size="3">
                        <ChevronsRight />
                    </IconButton>
                </div>

                <h1 className={styles.header}>
                    {startDate.getFullYear()}, {startDate.toLocaleString("en", { month: "long" })}
                </h1>
            </div>

            {dailies.map((daily) => (
                <Day daily={daily} key={daily.id} />
            ))}

            <ItemLoader shouldLoadNext={hasNextPage} onLoadNext={fetchNextPage}>
                {isFetching && "Loading..."} {/* TODO: Add skeleton here */}
            </ItemLoader>
        </main>
    );
};
