import { KeyboardEvent } from "react";
import { Checkbox as BaseCheckbox } from "react-aria-components";

import styles from "./styles/DailyEntryStatusCheckbox.module.scss";

import { DailyEntryComponentProps } from "@/features/entries/components/DailyEntry/components/shared/DailyEntryComponent";
import { handleDailyEntryComponentsNavigation } from "@/features/entries/components/DailyEntry/components/shared/handleDailyEntryComponentsNavigation.ts";

type DailyEntryStatusCheckboxProps = {
    onChange: (value: boolean) => void;
    value: boolean;
} & DailyEntryComponentProps;

export const DailyEntryStatusCheckbox = ({
    onChange,
    onNavigateDown,
    onNavigateRight,
    onNavigateUp,
    onNavigateLeft,
    value,
    column,
}: DailyEntryStatusCheckboxProps) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        handleDailyEntryComponentsNavigation(e, { onNavigateUp, onNavigateRight, onNavigateLeft, onNavigateDown });
    };

    return (
        <BaseCheckbox
            data-entry-column={column}
            onKeyDown={handleKeyDown}
            className={styles.checkbox}
            onChange={onChange}
            isSelected={value}
            validationBehavior="aria"
        >
            <div className={styles.svgWrapper}>
                <svg viewBox="0 0 18 18" aria-hidden="true">
                    <polyline points="4 4 14 14" />
                    <polyline points="14 4 4 14" />
                </svg>
            </div>
        </BaseCheckbox>
    );
};
