import { KeyboardEvent } from "react";
import { Ellipsis } from "lucide-react";

import styles from "./styles/DailyEntryGoalsTrigger.module.scss";

import { IconButton } from "@/components/IconButton";
import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";

type DailyEntryGoalsTriggerProps = {
    column: DailyEntryColumn;
    onNavigateRight: () => void;
    onNavigateDown: () => void;
    onNavigateUp: () => void;
};

export const DailyEntryGoalsTrigger = ({ column, onNavigateDown, onNavigateUp, onNavigateRight }: DailyEntryGoalsTriggerProps) => {
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
            iconSlot={Ellipsis}
            variant="subtle"
            size="1"
            className={styles.trigger}
        />
    );
};
