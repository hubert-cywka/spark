import { CalendarBaseProps } from "@/components/Calendar/types/CalendarBaseProps";
import { ISODateStringRange } from "@/types/ISODateString";

export type RangeCalendarProps = CalendarBaseProps & {
    value: ISODateStringRange | null;
    onChange?: (value: ISODateStringRange | null) => void;
};
