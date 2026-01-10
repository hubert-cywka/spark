import classNames from "clsx";

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
import { useDetectEntryCreation } from "@/features/entries/components/DailyEntry/hooks/useDetectEntryCreation.tsx";
import { LinkGoalsPopover } from "@/features/entries/components/LinkGoalsPopover/LinkGoalsPopover.tsx";
import { Entry } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type DailyEntryProps = {
    id: string;
    entry: Entry;
    onNavigateUp: (column: DailyEntryColumn) => void;
    onNavigateDown: (column: DailyEntryColumn) => void;
    onFocusColumn: (column: DailyEntryColumn) => void;
    onSaveContent: (entryId: string, content: string) => void;
    onChangeStatus: (entryId: string, status: boolean) => void;
    onChangeIsFeatured: (entryId: string, isFeatured: boolean) => void;
    onDelete: (entryId: string) => void;
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
    const { wasCreated } = useDetectEntryCreation(entry);

    return (
        <DailyEntryWrapper id={id}>
            <div className={classNames(styles.row, { [styles.highlight]: wasCreated })}>
                <DailyEntryContextMenu onDelete={() => onDelete(entry.id)}>
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
                    onChange={(status) => onChangeStatus(entry.id, status)}
                    value={entry.isCompleted}
                />

                <DailyEntryFeaturedCheckbox
                    column="featured"
                    onNavigateLeft={() => onFocusColumn("checkbox")}
                    onNavigateRight={() => onFocusColumn("goals")}
                    onNavigateUp={() => onNavigateUp("featured")}
                    onNavigateDown={() => onNavigateDown("featured")}
                    onChange={(isFeatured) => onChangeIsFeatured(entry.id, isFeatured)}
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
                    onSaveContent={(content) => onSaveContent(entry.id, content)}
                    onDelete={() => onDelete(entry.id)}
                    placeholder={t("entries.placeholder")}
                />
            </div>
        </DailyEntryWrapper>
    );
};
