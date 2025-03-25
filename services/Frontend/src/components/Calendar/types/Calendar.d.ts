import { ISODateString } from "@/features/daily/utils/dateUtils";
import { ISODateStringRange } from "@/types/ISODateString";

export type CalendarProps = {
    minDate?: ISODateString;
    maxDate?: ISODateString;
    value: ISODateStringRange | null;
    onChange?: (value: ISODateStringRange | null) => void;
    shownMonths?: number;
    shownMonthsOffset?: number;
};
