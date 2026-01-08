import { DateField, DateInput, DateSegment } from "react-aria-components";
import { fromDate } from "@internationalized/date";

import styles from "./styles/DayHeader.module.scss";

import { PassiveTextInput } from "@/components/PassiveTextInput/PassiveTextInput";
import { DayHeaderEditModeActionsRender } from "@/features/daily/components/DayHeader/components/DayHeaderEditModeActionsRender/DayHeaderEditModeActionsRender";
import { DayHeaderPassiveModeActionsRender } from "@/features/daily/components/DayHeader/components/DayHeaderPassiveModeActionsRender/DayHeaderPassiveModeActionsRender";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { ISODateString } from "@/types/ISODateString";

type DayHeaderProps = {
    date: ISODateString;
    onCreateEntryDraft: () => void;
};

export const DayHeader = ({ date, onCreateEntryDraft }: DayHeaderProps) => {
    const t = useTranslate();

    return (
        <PassiveTextInput
            value={mapToDateValue(date)}
            onChange={() => ({})}
            onRenderEditModeActions={DayHeaderEditModeActionsRender}
            onRenderPassiveModeActions={({ onStartEditMode, translationFn }) => (
                <DayHeaderPassiveModeActionsRender
                    date={date}
                    onCreateEntryDraft={onCreateEntryDraft}
                    onStartEditMode={onStartEditMode}
                    translationFn={translationFn}
                />
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
// const mapToISODate = (date: DateValue) => formatToISODateString(date.toDate("UTC"));
