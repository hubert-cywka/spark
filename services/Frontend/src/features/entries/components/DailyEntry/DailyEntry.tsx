import { DailyEntryContextMenu } from "./components/DailyEntryContextMenu/DailyEntryContextMenu.tsx";

import styles from "./styles/DailyEntry.module.scss";

import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import {
    DailyEntryGoalsPopupTrigger,
    DailyEntryInput,
    DailyEntryStatusCheckbox,
    DailyEntryWrapper,
} from "@/features/entries/components/DailyEntry/components";
import { DailyEntryContextMenuTrigger } from "@/features/entries/components/DailyEntry/components/DailyEntryContextMenuTrigger/DailyEntryContextMenuTrigger.tsx";
import { DailyEntryFeaturedCheckbox } from "@/features/entries/components/DailyEntry/components/DailyEntryFeaturedCheckbox/DailyEntryFeaturedCheckbox.tsx";
import { LinkGoalsPopover } from "@/features/entries/components/LinkGoalsPopover/LinkGoalsPopover.tsx";
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

    return (
        <DailyEntryWrapper id={id}>
            <div className={styles.row}>
                <DailyEntryContextMenu>
                    <DailyEntryContextMenuTrigger
                        column="actions"
                        onNavigateRight={() => onFocusColumn("checkbox")}
                        onNavigateUp={() => onNavigateUp("actions")}
                        onNavigateDown={() => onNavigateDown("actions")}
                    />
                </DailyEntryContextMenu>

                <DailyEntryStatusCheckbox
                    column="checkbox"
                    onNavigateLeft={() => onFocusColumn("actions")}
                    onNavigateRight={() => onFocusColumn("featured")}
                    onNavigateUp={() => onNavigateUp("checkbox")}
                    onNavigateDown={() => onNavigateDown("checkbox")}
                    onChange={(status) => onChangeStatus(entry, status)}
                    value={entry.isCompleted}
                />

                <DailyEntryFeaturedCheckbox
                    column="featured"
                    onNavigateLeft={() => onFocusColumn("checkbox")}
                    onNavigateRight={() => onFocusColumn("goals")}
                    onNavigateUp={() => onNavigateUp("featured")}
                    onNavigateDown={() => onNavigateDown("featured")}
                    onChange={(isFeatured) => onChangeIsFeatured(entry, isFeatured)}
                    value={entry.isFeatured}
                />

                <LinkGoalsPopover entryId={entry.id}>
                    <DailyEntryGoalsPopupTrigger
                        column="goals"
                        onNavigateLeft={() => onFocusColumn("featured")}
                        onNavigateRight={() => onFocusColumn("input")}
                        onNavigateUp={() => onNavigateUp("goals")}
                        onNavigateDown={() => onNavigateDown("goals")}
                    />
                </LinkGoalsPopover>

                <DailyEntryInput
                    column="input"
                    initialContent={entry.content}
                    onNavigateUp={() => onNavigateUp("input")}
                    onNavigateDown={() => onNavigateDown("input")}
                    onNavigateLeft={() => onFocusColumn("goals")}
                    onSaveContent={(content) => onSaveContent(entry, content)}
                    onDelete={() => onDelete(entry.dailyId, entry.id)}
                    placeholder={t("entries.placeholder")}
                />
            </div>
        </DailyEntryWrapper>
    );
};
