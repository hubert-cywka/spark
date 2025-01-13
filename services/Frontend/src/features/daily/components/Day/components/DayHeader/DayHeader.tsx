import { KeyboardEvent, useEffect, useState } from "react";
import { DateField, DateInput, DateSegment, DateValue } from "react-aria-components";
import { fromDate } from "@internationalized/date";

import styles from "./styles/DayHeader.module.scss";

import { DailyEditModeActions } from "@/features/daily/components/Day/components/DailyEditModeActions/DailyEditModeActions";
import { DailyPassiveModeActions } from "@/features/daily/components/Day/components/DailyPassiveModeActions/DailyPassiveModeActions";
import { useDayHeaderEditMode } from "@/features/daily/components/Day/components/DayHeader/hooks/useDayHeaderEditMode";
import { useUpdateDailyDate } from "@/features/daily/hooks/useUpdateDailyDate";
import { useUpdateDailyDateEvents } from "@/features/daily/hooks/useUpdateDailyDateEvents";
import { Daily } from "@/features/daily/types/Daily";
import { getFormattedDailyDate } from "@/features/daily/utils/dateUtils";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const SEGMENT_SELECTOR = '[role="spinbutton"]';

type DayHeaderProps = {
    daily: Daily;
};

export const DayHeader = ({ daily }: DayHeaderProps) => {
    const t = useTranslate();
    const [value, setValue] = useState<DateValue | null>(() => mapToDateValue(daily.date));

    const { mutateAsync: updateDate, isPending: isUpdating } = useUpdateDailyDate();
    const { onUpdateDailyDateError, onUpdateDailyDateSuccess } = useUpdateDailyDateEvents();
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

        try {
            await updateDate({ id: daily.id, date: mapToISODate(value) });
            onUpdateDailyDateSuccess();
            endEditMode();
        } catch (err) {
            onUpdateDailyDateError(err);
        }
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
            {isUpdating && <div className={styles.updateLabel}>{t("daily.updateDate.labels.inProgress")}</div>}
        </div>
    );
};

const mapToDateValue = (date: string) => fromDate(new Date(date), "UTC");
const mapToISODate = (date: DateValue) => getFormattedDailyDate(date.toDate("UTC"));
