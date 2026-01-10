import { ISODateString } from "@/features/daily/utils/dateUtils.ts";

export type CalendarBaseProps = {
    minDate?: ISODateString;
    maxDate?: ISODateString;
    shownMonths?: number;
    shownMonthsOffset?: number;
};
