import { KeyboardEvent, useEffect, useState } from "react";
import { DateInput, DateSegment, TimeField, TimeValue } from "react-aria-components";
import { Time } from "@internationalized/date";
import { Check, Pencil, X } from "lucide-react";

import styles from "./styles/AlertTimeInput.module.scss";

import { IconButton } from "@/components/IconButton";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

const SEGMENT_SELECTOR = '[role="spinbutton"]';

type AlertTimeInputProps = {
    value: string;
    onChange: (time: string) => void;
};

// TODO: Clean up, maybe remove duplication of DayHeader
export const AlertTimeInput = ({ value, onChange }: AlertTimeInputProps) => {
    const t = useTranslate();
    const [internalValue, setInternalValue] = useState<TimeValue | null>(() => mapToDateValue(value));
    const hasValueChanged = !!internalValue && mapToISODate(internalValue) !== value;

    const restoreInitialValue = () => {
        setInternalValue(mapToDateValue(value));
    };

    const blur = () => {
        const focusableElements = ref.current?.querySelectorAll(SEGMENT_SELECTOR);
        focusableElements?.forEach((element) => (element as HTMLElement).blur());
    };

    const [isInEditMode, setIsInEditMode] = useState(false);
    const startEditMode = () => setIsInEditMode(true);

    const endEditMode = () => {
        setIsInEditMode(false);
        blur();
    };

    const cancelEditMode = () => {
        endEditMode();
        restoreInitialValue();
    };

    const confirmValueUpdate = async () => {
        if (!internalValue || !isInEditMode) {
            return;
        }

        onChange(mapToISODate(internalValue));
        endEditMode();
    };

    const updateValueOnEnter = async (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && isInEditMode) {
            e.preventDefault();
            await confirmValueUpdate();
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
            <TimeField
                aria-label={t("daily.day.date.label")}
                value={internalValue}
                onChange={setInternalValue}
                onKeyDown={updateValueOnEnter}
                granularity="second"
                shouldForceLeadingZeros
                validationBehavior="aria"
                hideTimeZone
                isDisabled={!isInEditMode}
            >
                <DateInput className={styles.input}>{(segment) => <DateSegment className={styles.segment} segment={segment} />}</DateInput>
            </TimeField>

            <div className={styles.buttons}>
                {isInEditMode ? (
                    <>
                        <IconButton variant="secondary" size="1" onPress={cancelEditMode} iconSlot={X} />
                        <IconButton
                            size="1"
                            variant="confirm"
                            onPress={confirmValueUpdate}
                            isDisabled={!hasValueChanged}
                            iconSlot={Check}
                        />
                    </>
                ) : (
                    <IconButton variant="secondary" size="1" onPress={startEditMode} iconSlot={Pencil} />
                )}
            </div>
        </div>
    );
};

const mapToDateValue = (time: string) => {
    const [hour, minute, second] = time.split(":");
    return new Time(parseInt(hour), parseInt(minute), parseInt(second));
};

const mapToISODate = (time: TimeValue) => {
    const hh = String(time.hour).padStart(2, "0");
    const mm = String(time.minute).padStart(2, "0");
    const ss = String(time.second).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
};
