import { KeyboardEvent } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import styles from "./styles/DailyEntryExpandTrigger.module.scss";

import { IconButton } from "@/components/IconButton";
import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";

type DailyEntryGoalsTriggerProps = {
    column: DailyEntryColumn;
    onNavigateRight: () => void;
    onNavigateDown: () => void;
    onNavigateUp: () => void;
    isCollapsed: boolean;
    onClick: () => void;
};

export const DailyEntryExpandTrigger = ({
    column,
    onNavigateDown,
    onNavigateUp,
    onNavigateRight,
    isCollapsed,
    onClick,
}: DailyEntryGoalsTriggerProps) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
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

        if (e.key === "ArrowDown") {
            e.preventDefault();
            onNavigateDown();
        }
    };

    return (
        <IconButton
            data-entry-column={column}
            onKeyDown={handleKeyDown}
            size="1"
            variant="subtle"
            iconSlot={isCollapsed ? ChevronDown : ChevronUp}
            className={styles.trigger}
            onPress={onClick}
        />
    );
};
