import { DateInput as BaseDateInput, DateSegment } from "react-aria-components";
import classNames from "clsx";

import ownStyles from "@/components/Input/styles/DateInput.module.scss";

import { InputSize } from "@/components/Input/types/Input";

type DateInputSegmentProps = {
    size?: InputSize;
    slot?: string;
    className?: string;
};

export const SegmentedDateInputSlot = ({ size = "2", slot, className }: DateInputSegmentProps) => {
    return (
        <BaseDateInput slot={slot} className={classNames(ownStyles.input, className)} data-size={size}>
            {(segment) => <DateSegment className={ownStyles.dateSegment} segment={segment} />}
        </BaseDateInput>
    );
};
