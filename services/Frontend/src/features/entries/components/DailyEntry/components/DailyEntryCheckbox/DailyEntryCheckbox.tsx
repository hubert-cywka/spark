import { KeyboardEvent } from "react";
import { Checkbox as BaseCheckbox } from "react-aria-components";

import styles from "./styles/DailyEntryCheckbox.module.scss";

import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";

type DailyEntryCheckboxProps = {
    onChange: (value: boolean) => void;
    value: boolean;
    onNavigateRight: () => void;
    onNavigateLeft: () => void;
    onNavigateDown: () => void;
    onNavigateUp: () => void;
    column: DailyEntryColumn;
};

export const DailyEntryCheckbox = ({
    onChange,
    onNavigateDown,
    onNavigateRight,
    onNavigateUp,
    onNavigateLeft,
    value,
    column,
}: DailyEntryCheckboxProps) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            onNavigateUp();
            return;
        }

        if (e.key === "ArrowRight") {
            e.preventDefault();
            onNavigateRight();
            return;
        }

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            onNavigateLeft();
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            onNavigateDown();
        }
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
