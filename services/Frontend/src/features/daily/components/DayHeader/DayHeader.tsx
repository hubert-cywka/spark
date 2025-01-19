import { KeyboardEvent, useEffect, useState } from "react";
import { DateField, DateInput, DateSegment, DateValue } from "react-aria-components";
import { fromDate } from "@internationalized/date";

import styles from "./styles/DayHeader.module.scss";

import { DailyEditModeActions } from "@/features/daily/components/DayHeader/components/DailyEditModeActions/DailyEditModeActions";
import { DailyPassiveModeActions } from "@/features/daily/components/DayHeader/components/DailyPassiveModeActions/DailyPassiveModeActions";
import { useDayHeaderEditMode } from "@/features/daily/components/DayHeader/hooks/useDayHeaderEditMode";
import { Daily } from "@/features/daily/types/Daily";
import { getFormattedDailyDate } from "@/features/daily/utils/dateUtils";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const SEGMENT_SELECTOR = '[role="spinbutton"]';

type DayHeaderProps = {
    daily: Daily;
    onUpdateDate: (id: string, date: string) => void;
};

export const DayHeader = ({ daily, onUpdateDate }: DayHeaderProps) => {
    const t = useTranslate();
    const [value, setValue] = useState<DateValue | null>(() => mapToDateValue(daily.date));

    const hasValueChanged = !!value && mapToISODate(value) !== daily.date;

    const restoreInitialValue = () => {
        setValue(mapToDateValue(daily.date));
    };

    const blur = () => {
        const focusableElements = ref.current?.querySelectorAll(SEGMENT_SELECTOR);
        focusableElements?.forEach((element) => (element as HTMLElement).blur());
    };

    const { isInEditMode, cancelEditMode, startEditMode, endEditMode } = useDayHeaderEditMode({
        onCancel: restoreInitialValue,
        onEnd: blur,
    });

    const confirmNameUpdate = async () => {
        if (!value || !isInEditMode) {
            return;
        }

        onUpdateDate(daily.id, mapToISODate(value));
        endEditMode();
    };

    const updateNameOnEnter = async (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && isInEditMode) {
            e.preventDefault();
            await confirmNameUpdate();
        }
    };

    const ref = useOutsideClick<HTMLDivElement>(cancelEditMode);
    useKeyboardShortcut({ keys: ["Escape"], callback: cancelEditMode });

    useEffect(
        function autoFocusOnEditModeChange() {
            if (isInEditMode && ref.current) {
                const focusableElement = ref.current.querySelector(SEGMENT_SELECTOR) as HTMLElement | null;
                focusableElement?.focus();
            }
        },
        [isInEditMode, ref]
    );

    return (
        <div className={styles.header} ref={ref}>
            <DateField
                aria-label={t("daily.day.date.label")}
                value={value}
                onChange={setValue}
                onKeyDown={updateNameOnEnter}
                granularity="day"
                shouldForceLeadingZeros
                validationBehavior="aria"
                isDisabled={!isInEditMode}
            >
                <DateInput className={styles.input}>{(segment) => <DateSegment className={styles.segment} segment={segment} />}</DateInput>
            </DateField>

            <div className={styles.buttons}>
                {isInEditMode ? (
                    <DailyEditModeActions onCancel={cancelEditMode} onSave={confirmNameUpdate} isSaveDisabled={!hasValueChanged} />
                ) : (
                    <DailyPassiveModeActions daily={daily} onStartEditMode={startEditMode} />
                )}
            </div>
        </div>
    );
};

const mapToDateValue = (date: string) => fromDate(new Date(date), "UTC");
const mapToISODate = (date: DateValue) => getFormattedDailyDate(date.toDate("UTC"));
