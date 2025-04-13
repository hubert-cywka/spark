import dayjs from "dayjs";

import { ISODateStringRange } from "@/types/Date";

export const isOutsideDateRange = (dateRange: ISODateStringRange, timezone: string = "UTC") => {
    const nowTimezoneAdjusted = dayjs().tz(timezone);
    const toTimezoneAdjusted = dayjs.tz(dateRange.to, timezone).endOf("day");
    const fromTimezoneAdjusted = dayjs.tz(dateRange.from, timezone).startOf("day");

    return nowTimezoneAdjusted.isAfter(toTimezoneAdjusted) || nowTimezoneAdjusted.isBefore(fromTimezoneAdjusted);
};
