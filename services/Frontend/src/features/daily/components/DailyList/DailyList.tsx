"use client";

import styles from "./styles/DailyList.module.scss";

import { ItemLoader } from "@/components/ItemLoader/ItemLoader";
import { DailyListHeader } from "@/features/daily/components/DailyList/components/DailyListHeader/DailyListHeader";
import { useDailyDateRange } from "@/features/daily/components/DailyList/hooks/useDailyDateRange";
import { DaySkeleton } from "@/features/daily/components/Day";
import { Day } from "@/features/daily/components/Day/Day";
import { useDailies } from "@/features/daily/hooks/useDailies";
import { getFormattedDailyDate } from "@/features/daily/utils/dateUtils";

export const DailyList = () => {
    const { setPrev, setNext, reset, endDate, startDate } = useDailyDateRange({
        granularity: "month",
    });
    const { data, hasNextPage, fetchNextPage, isFetching } = useDailies({
        from: getFormattedDailyDate(startDate),
        to: getFormattedDailyDate(endDate),
    });
    const dailies = data?.pages?.flatMap((page) => page.data) ?? [];

    return (
        <main className={styles.container}>
            <DailyListHeader onReset={reset} onNextTimeframe={setNext} onPrevTimeframe={setPrev} timeframeStart={startDate} />

            {dailies.map((daily) => (
                <Day daily={daily} key={daily.id} />
            ))}

            <ItemLoader shouldLoadNext={hasNextPage} onLoadNext={fetchNextPage}>
                {isFetching && <DaySkeleton count={10} />}
            </ItemLoader>
        </main>
    );
};
