import { useState } from "react";

import styles from "./styles/DailyEntry.module.scss";

import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import { DailyEntryCheckbox } from "@/features/entries/components/DailyEntry/components/DailyEntryCheckbox/DailyEntryCheckbox";
import { DailyEntryExpandTrigger } from "@/features/entries/components/DailyEntry/components/DailyEntryExpandTrigger/DailyEntryExpandTrigger";
import { DailyEntryInput } from "@/features/entries/components/DailyEntry/components/DailyEntryInput/DailyEntryInput";
import { DailyEntryWrapper } from "@/features/entries/components/DailyEntry/components/DailyEntryWrapper/DailyEntryWrapper";
import { EntryGoalsList } from "@/features/entries/components/EntryGoalsList/EntryGoalsList";
import { Entry } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type DailyEntryProps = {
    id: string;
    entry: Entry;
    onNavigateUp: (column: DailyEntryColumn) => void;
    onNavigateDown: (column: DailyEntryColumn) => void;
    onFocusColumn: (column: DailyEntryColumn) => void;
    onSaveContent: (entry: Entry, content: string) => void;
    onChangeStatus: (entry: Entry, status: boolean) => void;
    onDelete: (dailyId: string, entryId: string) => void;
};

export const DailyEntry = ({
    id,
    entry,
    onSaveContent,
    onDelete,
    onNavigateUp,
    onNavigateDown,
    onChangeStatus,
    onFocusColumn,
}: DailyEntryProps) => {
    const t = useTranslate();
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <DailyEntryWrapper id={id}>
            <div className={styles.row}>
                <DailyEntryExpandTrigger
                    column="expand"
                    isCollapsed={isCollapsed}
                    onClick={() => setIsCollapsed((p) => !p)}
                    onNavigateRight={() => onFocusColumn("checkbox")}
                    onNavigateUp={() => onNavigateUp("expand")}
                    onNavigateDown={() => onNavigateDown("expand")}
                />

                <DailyEntryCheckbox
                    column="checkbox"
                    onNavigateLeft={() => onFocusColumn("expand")}
                    onNavigateRight={() => onFocusColumn("input")}
                    onNavigateUp={() => onNavigateUp("checkbox")}
                    onNavigateDown={() => onNavigateDown("checkbox")}
                    onChange={(status) => onChangeStatus(entry, status)}
                    value={entry.isCompleted}
                />

                <DailyEntryInput
                    column="input"
                    initialContent={entry.content}
                    onNavigateUp={() => onNavigateUp("input")}
                    onNavigateDown={() => onNavigateDown("input")}
                    onNavigateLeft={() => onFocusColumn("checkbox")}
                    onSaveContent={(content) => onSaveContent(entry, content)}
                    onDelete={() => onDelete(entry.dailyId, entry.id)}
                    placeholder={t("entries.placeholder")}
                />
            </div>

            {!isCollapsed && (
                <div className={styles.metadata}>
                    <EntryGoalsList entryId={entry.id} />
                </div>
            )}
        </DailyEntryWrapper>
    );
};
