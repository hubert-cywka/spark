import { KeyboardEvent } from "react";
import { TargetIcon } from "lucide-react";

import styles from "./styles/DailyEntryGoalsPopupTrigger.module.scss";

import { IconButton } from "@/components/IconButton";
import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DailyEntryGoalsPopupTriggerProps = {
    column: DailyEntryColumn;
    onNavigateLeft?: () => void;
    onNavigateRight?: () => void;
    onNavigateDown?: () => void;
    onNavigateUp?: () => void;
};

export const DailyEntryGoalsPopupTrigger = ({
    column,
    onNavigateLeft,
    onNavigateDown,
    onNavigateUp,
    onNavigateRight,
}: DailyEntryGoalsPopupTriggerProps) => {
    const t = useTranslate();

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            onNavigateUp?.();
            return;
        }

        if (e.key === "ArrowRight") {
            e.preventDefault();
            onNavigateRight?.();
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            onNavigateDown?.();
            return;
        }

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            onNavigateLeft?.();
        }
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
