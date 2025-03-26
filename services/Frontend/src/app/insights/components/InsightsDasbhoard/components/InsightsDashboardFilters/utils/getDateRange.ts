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

export const getPresetFromDateRange = (dateRange: ISODateStringRange): DateRangePreset | null => {
    const now = dayjs();
    const sameDayLastMonth = now.subtract(1, "month");
    const sameDayLastYear = now.subtract(1, "year");

    const compareRanges = (from: dayjs.Dayjs, to: dayjs.Dayjs): boolean => {
        return dayjs(dateRange.from).isSame(from, "day") && dayjs(dateRange.to).isSame(to, "day");
    };

    if (compareRanges(sameDayLastYear, now)) {
        return DateRangePreset.PAST_YEAR;
    }

    if (compareRanges(now.startOf("year"), now)) {
        return DateRangePreset.THIS_YEAR;
    }

    if (compareRanges(sameDayLastYear.startOf("year"), sameDayLastYear.endOf("year"))) {
        return DateRangePreset.LAST_YEAR;
    }

    if (compareRanges(sameDayLastMonth, now)) {
        return DateRangePreset.PAST_MONTH;
    }

    if (compareRanges(now.startOf("month"), now)) {
        return DateRangePreset.THIS_MONTH;
    }

    if (compareRanges(sameDayLastMonth.startOf("month"), sameDayLastMonth.endOf("month"))) {
        return DateRangePreset.LAST_MONTH;
    }

    return null;
};

const format = (date: dayjs.Dayjs): ISODateString => {
    return formatToISODateString(date.toDate());
};
