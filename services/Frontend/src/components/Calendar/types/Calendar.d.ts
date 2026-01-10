import { CalendarBaseProps } from "@/components/Calendar/types/CalendarBaseProps";
import { ISODateString } from "@/features/daily/utils/dateUtils";

export type CalendarProps = CalendarBaseProps & {
    value: ISODateString | null;
    onChange?: (value: ISODateString | null) => void;
};
