import dayjs from "dayjs";

import { type ISODateStringRange, ISODateString } from "@/types/Date";

export const isOutsideDateRange = (dateRange: ISODateStringRange, timezone: string = "UTC") => {
    const nowTimezoneAdjusted = dayjs().tz(timezone);
    const toTimezoneAdjusted = dayjs.tz(dateRange.to, timezone).endOf("day");
    const fromTimezoneAdjusted = dayjs.tz(dateRange.from, timezone).startOf("day");

    return nowTimezoneAdjusted.isAfter(toTimezoneAdjusted) || nowTimezoneAdjusted.isBefore(fromTimezoneAdjusted);
};

export const formatToISODateString = (date: Date): ISODateString => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
};
