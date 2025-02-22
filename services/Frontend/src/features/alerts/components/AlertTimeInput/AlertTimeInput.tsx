import { DateInput, DateSegment, TimeField, TimeValue } from "react-aria-components";
import { Time } from "@internationalized/date";

import styles from "./styles/AlertTimeInput.module.scss";

import { PassiveTextInput } from "@/components/PassiveTextInput";
import { AlertTimeInputEditModeActionsRender } from "@/features/alerts/components/AlertTimeInput/components/AlertTimeInputEditModeActionsRender/AlertTimeInputEditModeActionsRender";
import { AlertTimeInputPassiveModeActionsRender } from "@/features/alerts/components/AlertTimeInput/components/AlertTimeInputPassiveModeActionsRender/AlertTimeInputPassiveModeActionsRender";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type AlertTimeInputProps = {
    value: string;
    onChange: (time: string) => void;
};

export const AlertTimeInput = ({ value, onChange }: AlertTimeInputProps) => {
    const t = useTranslate();

    return (
        <PassiveTextInput
            value={mapToDateValue(value)}
            onChange={(value) => onChange(mapToISODate(value))}
            onRenderEditModeActions={AlertTimeInputEditModeActionsRender}
            onRenderPassiveModeActions={AlertTimeInputPassiveModeActionsRender}
        >
            {(props) => (
                <TimeField
                    aria-label={t("daily.day.date.label")}
                    granularity="second"
                    shouldForceLeadingZeros
                    validationBehavior="aria"
                    hideTimeZone
                    {...props}
                >
                    <DateInput className={styles.input}>
                        {(segment) => <DateSegment className={styles.segment} segment={segment} />}
                    </DateInput>
                </TimeField>
            )}
        </PassiveTextInput>
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
