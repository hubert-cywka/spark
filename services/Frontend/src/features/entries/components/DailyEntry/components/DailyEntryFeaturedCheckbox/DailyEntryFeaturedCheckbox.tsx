import { KeyboardEvent } from "react";
import { Checkbox as BaseCheckbox } from "react-aria-components";
import { Star } from "lucide-react";

import styles from "./styles/DailyEntryFeaturedCheckbox.module.scss";

import { DailyEntryComponentProps } from "@/features/entries/components/DailyEntry/components/shared/DailyEntryComponent";
import { handleDailyEntryComponentsNavigation } from "@/features/entries/components/DailyEntry/components/shared/handleDailyEntryComponentsNavigation.ts";

type DailyEntryFeaturedCheckboxProps = {
    onChange: (value: boolean) => void;
    value: boolean;
} & DailyEntryComponentProps;

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
            <Star />
        </BaseCheckbox>
    );
};
