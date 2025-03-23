import { DateField, DateInput, DateSegment, DateValue } from "react-aria-components";
import { fromDate } from "@internationalized/date";

import styles from "./styles/DayHeader.module.scss";

import { PassiveTextInput } from "@/components/PassiveTextInput/PassiveTextInput";
import { DayHeaderEditModeActionsRender } from "@/features/daily/components/DayHeader/components/DayHeaderEditModeActionsRender/DayHeaderEditModeActionsRender";
import { DayHeaderPassiveModeActionsRender } from "@/features/daily/components/DayHeader/components/DayHeaderPassiveModeActionsRender/DayHeaderPassiveModeActionsRender";
import { Daily } from "@/features/daily/types/Daily";
import { formatToISODateString } from "@/features/daily/utils/dateUtils";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type DayHeaderProps = {
    daily: Daily;
    onUpdateDate: (id: string, date: string) => void;
};

export const DayHeader = ({ daily, onUpdateDate }: DayHeaderProps) => {
    const t = useTranslate();

    return (
        <PassiveTextInput
            value={mapToDateValue(daily.date)}
            onChange={(value) => onUpdateDate(daily.id, mapToISODate(value))}
            onRenderEditModeActions={DayHeaderEditModeActionsRender}
            onRenderPassiveModeActions={({ onStartEditMode }) => (
                <DayHeaderPassiveModeActionsRender onStartEditMode={onStartEditMode} daily={daily} />
            )}
        >
            {(props) => (
                <DateField
                    aria-label={t("daily.day.date.label")}
                    granularity="day"
                    shouldForceLeadingZeros
                    validationBehavior="aria"
                    hideTimeZone
                    {...props}
                >
                    <DateInput className={styles.input}>
                        {(segment) => <DateSegment className={styles.segment} segment={segment} />}
                    </DateInput>
                </DateField>
            )}
        </PassiveTextInput>
    );
};

const mapToDateValue = (date: string) => fromDate(new Date(date), "UTC");
const mapToISODate = (date: DateValue) => formatToISODateString(date.toDate("UTC"));
