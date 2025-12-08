import { KeyboardEvent } from "react";
import { MenuIcon } from "lucide-react";

import styles from "./styles/DailyEntryContextMenuTrigger.module.scss";

import { IconButton } from "@/components/IconButton";
import { DailyEntryComponentProps } from "@/features/entries/components/DailyEntry/components/shared/DailyEntryComponent";
import { handleDailyEntryComponentsNavigation } from "@/features/entries/components/DailyEntry/components/shared/handleDailyEntryComponentsNavigation.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DailyEntryContextMenuTriggerProps = DailyEntryComponentProps;
export const DailyEntryContextMenuTrigger = ({
    column,
    onNavigateLeft,
    onNavigateDown,
    onNavigateUp,
    onNavigateRight,
}: DailyEntryContextMenuTriggerProps) => {
    const t = useTranslate();

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        handleDailyEntryComponentsNavigation(e, { onNavigateUp, onNavigateRight, onNavigateLeft, onNavigateDown });
    };

    return (
        <IconButton
            size="1"
            variant="subtle"
            iconSlot={MenuIcon}
            tooltip={t("entries.goals.list.showActionsButton.label")}
            aria-label={t("entries.goals.list.showActionsButton.label")}
            data-entry-column={column}
            onKeyDown={handleKeyDown}
            className={styles.trigger}
        />
    );
};
