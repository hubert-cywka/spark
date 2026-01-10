import { ReactNode } from "react";

import { InputSize } from "@/components/Input";

export type DatePickerBaseProps = {
    label: ReactNode;
    calendarProps?: {
        shownMonths?: number;
    };
    size?: InputSize;
    required?: boolean;
    error?: string;
    minimal?: boolean;
    className?: string;
};
