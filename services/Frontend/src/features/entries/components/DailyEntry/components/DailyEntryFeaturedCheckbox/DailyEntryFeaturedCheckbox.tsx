import { KeyboardEvent } from "react";
import { Checkbox as BaseCheckbox } from "react-aria-components";
import { Star } from "lucide-react";

import styles from "./styles/DailyEntryFeaturedCheckbox.module.scss";

import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";

type DailyEntryFeaturedCheckboxProps = {
    onChange: (value: boolean) => void;
    value: boolean;
    onNavigateRight: () => void;
    onNavigateLeft: () => void;
    onNavigateDown: () => void;
    onNavigateUp: () => void;
    column: DailyEntryColumn;
};

export const DailyEntryFeaturedCheckbox = ({
    onChange,
    onNavigateDown,
    onNavigateRight,
    onNavigateUp,
    onNavigateLeft,
    value,
    column,
}: DailyEntryFeaturedCheckboxProps) => {
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
            <Star />
        </BaseCheckbox>
    );
};
