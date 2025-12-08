import { KeyboardEvent } from "react";
import { TargetIcon } from "lucide-react";

import styles from "./styles/DailyEntryGoalsPopupTrigger.module.scss";

import { IconButton } from "@/components/IconButton";
import { DailyEntryComponentProps } from "@/features/entries/components/DailyEntry/components/shared/DailyEntryComponent";
import { handleDailyEntryComponentsNavigation } from "@/features/entries/components/DailyEntry/components/shared/handleDailyEntryComponentsNavigation.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DailyEntryGoalsPopupTriggerProps = DailyEntryComponentProps;

export const DailyEntryGoalsPopupTrigger = ({
    column,
    onNavigateLeft,
    onNavigateDown,
    onNavigateUp,
    onNavigateRight,
}: DailyEntryGoalsPopupTriggerProps) => {
    const t = useTranslate();

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        handleDailyEntryComponentsNavigation(e, { onNavigateUp, onNavigateRight, onNavigateLeft, onNavigateDown });
    };

    return (
        <IconButton
            size="1"
            variant="subtle"
            iconSlot={TargetIcon}
            tooltip={t("entries.goals.list.showLinksButton.label")}
            aria-label={t("entries.goals.list.showLinksButton.label")}
            data-entry-column={column}
            onKeyDown={handleKeyDown}
            className={styles.trigger}
        />
    );
};
