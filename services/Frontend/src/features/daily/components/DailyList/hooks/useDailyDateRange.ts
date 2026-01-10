import { useMemo, useState } from "react";
import dayjs from "dayjs";

import { formatToISODateString } from "@/features/daily/utils/dateUtils.ts";

type UseDailyDateRangeOptions = {
    granularity: "year" | "month" | "day";
};

export const useDailyDateRange = ({ granularity }: UseDailyDateRangeOptions) => {
    const [startDate, setStartDate] = useState<Date>(() => dayjs().startOf(granularity).toDate());
    const endDate = dayjs(startDate).endOf(granularity).toDate();

    const adjustDate = (amount: number) => {
        setStartDate((previous) => dayjs(previous).add(amount, granularity).toDate());
    };

    const setPrev = (amount: number = 1) => adjustDate(amount * -1);
    const setNext = (amount: number = 1) => adjustDate(amount);

    const setRange = (start: Date) => {
        setStartDate(start);
    };

    const defaultDate = useMemo(() => {
        const now = dayjs();

        if (now.isAfter(startDate) && now.isBefore(endDate)) {
            return formatToISODateString(now.toDate());
        } else {
            return formatToISODateString(startDate);
        }
    }, [endDate, startDate]);

    const reset = () => setStartDate(dayjs().startOf(granularity).toDate());

    return { startDate, endDate, setRange, setPrev, setNext, reset, defaultDate };
};
