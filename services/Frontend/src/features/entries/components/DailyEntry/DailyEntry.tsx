import { useState } from "react";

import styles from "./styles/DailyEntry.module.scss";

import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import {
    DailyEntryExpandTrigger,
    DailyEntryInput,
    DailyEntryStatusCheckbox,
    DailyEntryWrapper,
} from "@/features/entries/components/DailyEntry/components";
import { DailyEntryFeaturedCheckbox } from "@/features/entries/components/DailyEntry/components/DailyEntryFeaturedCheckbox/DailyEntryFeaturedCheckbox.tsx";
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
    onChangeIsFeatured: (entry: Entry, isFeatured: boolean) => void;
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
    onChangeIsFeatured,
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

                <DailyEntryStatusCheckbox
                    column="checkbox"
                    onNavigateLeft={() => onFocusColumn("expand")}
                    onNavigateRight={() => onFocusColumn("featured")}
                    onNavigateUp={() => onNavigateUp("checkbox")}
                    onNavigateDown={() => onNavigateDown("checkbox")}
                    onChange={(status) => onChangeStatus(entry, status)}
                    value={entry.isCompleted}
                />

                <DailyEntryFeaturedCheckbox
                    column="featured"
                    onNavigateLeft={() => onFocusColumn("checkbox")}
                    onNavigateRight={() => onFocusColumn("input")}
                    onNavigateUp={() => onNavigateUp("featured")}
                    onNavigateDown={() => onNavigateDown("featured")}
                    onChange={(isFeatured) => onChangeIsFeatured(entry, isFeatured)}
                    value={entry.isFeatured}
                />

                <DailyEntryInput
                    column="input"
                    initialContent={entry.content}
                    onNavigateUp={() => onNavigateUp("input")}
                    onNavigateDown={() => onNavigateDown("input")}
                    onNavigateLeft={() => onFocusColumn("featured")}
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
