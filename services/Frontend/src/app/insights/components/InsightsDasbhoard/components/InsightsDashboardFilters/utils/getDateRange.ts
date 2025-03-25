import dayjs from "dayjs";

import { formatToISODateString } from "@/features/daily/utils/dateUtils";
import { DateRangePreset } from "@/types/DateRangePreset";
import { ISODateString, ISODateStringRange } from "@/types/ISODateString";

export const getDateRange = (preset: DateRangePreset): ISODateStringRange => {
    const now = dayjs();
    const sameDayLastMonth = now.subtract(1, "month");
    const sameDayLastYear = now.subtract(1, "year");

    switch (preset) {
        case DateRangePreset.PAST_YEAR:
            return {
                from: format(sameDayLastYear),
                to: format(now),
            };
        case DateRangePreset.THIS_YEAR:
            return {
                from: format(now.startOf("year")),
                to: format(now),
            };
        case DateRangePreset.LAST_YEAR:
            return {
                from: format(sameDayLastYear.startOf("year")),
                to: format(sameDayLastYear.endOf("year")),
            };
        case DateRangePreset.PAST_MONTH:
            return {
                from: format(sameDayLastMonth),
                to: format(now),
            };
        case DateRangePreset.THIS_MONTH:
            return {
                from: format(now.startOf("month")),
                to: format(now),
            };
        case DateRangePreset.LAST_MONTH:
            return {
                from: format(sameDayLastMonth.startOf("month")),
                to: format(sameDayLastMonth.endOf("month")),
            };
    }
};

const format = (date: dayjs.Dayjs): ISODateString => {
    return formatToISODateString(date.toDate());
};
