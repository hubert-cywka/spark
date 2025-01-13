"use client";

import dayjs from "dayjs";

import styles from "./styles/DailyList.module.scss";

import { ItemLoader } from "@/components/ItemLoader/ItemLoader";
import { DailyListHeader } from "@/features/daily/components/DailyList/components/DailyListHeader/DailyListHeader";
import { useDailyDateRange } from "@/features/daily/components/DailyList/hooks/useDailyDateRange";
import { DaySkeleton } from "@/features/daily/components/Day";
import { DayHeader } from "@/features/daily/components/Day/components/DayHeader/DayHeader";
import { Day } from "@/features/daily/components/Day/Day";
import { useCreateDaily } from "@/features/daily/hooks/useCreateDaily";
import { useCreateDailyEvents } from "@/features/daily/hooks/useCreateDailyEvents";
import { useDailies } from "@/features/daily/hooks/useDailies";
import { getFormattedDailyDate } from "@/features/daily/utils/dateUtils";

// TODO: Create dailies in more user-friendly way
export const DailyList = () => {
    const { setPrev, setNext, reset, endDate, startDate } = useDailyDateRange({
        granularity: "month",
    });
    const { data, hasNextPage, fetchNextPage, isFetching, queryKey } = useDailies({
        from: getFormattedDailyDate(startDate),
        to: getFormattedDailyDate(endDate),
    });
    const dailies = data?.pages?.flatMap((page) => page.data) ?? [];

    const { onCreateDailyError, onCreateDailySuccess } = useCreateDailyEvents();
    const { mutateAsync: createDaily } = useCreateDaily({ queryKey });

    const createNewDaily = async () => {
        let newDailyDate = dayjs();

        if (!newDailyDate.isBefore(endDate) || !newDailyDate.isAfter(startDate)) {
            newDailyDate = dayjs(startDate);
        }

        try {
            await createDaily({
                date: getFormattedDailyDate(newDailyDate.toDate()),
            });
            onCreateDailySuccess();
        } catch (err) {
            onCreateDailyError(err);
        }
    };

    return (
        <main className={styles.container}>
            <DailyListHeader
                onCreateNewDaily={createNewDaily}
                onNextTimeframe={setNext}
                onPrevTimeframe={setPrev}
                onReset={reset}
                timeframeStart={startDate}
            />

            {dailies.map((daily) => (
                <Day key={daily.id}>
                    <DayHeader daily={daily} />
                </Day>
            ))}

            <ItemLoader shouldLoadNext={hasNextPage} onLoadNext={fetchNextPage}>
                {isFetching && <DaySkeleton count={3} />}
            </ItemLoader>
        </main>
    );
};
