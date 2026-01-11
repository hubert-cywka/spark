import { useState } from "react";
import classNames from "clsx";

import { DailyEntryContextMenu } from "./components/DailyEntryContextMenu/DailyEntryContextMenu.tsx";

import styles from "./styles/DailyEntry.module.scss";

import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import { DailyEntryInput, DailyEntryStatusCheckbox, DailyEntryWrapper } from "@/features/entries/components/DailyEntry/components";
import { DailyEntryContextMenuTrigger } from "@/features/entries/components/DailyEntry/components/DailyEntryContextMenuTrigger/DailyEntryContextMenuTrigger.tsx";
import { DailyEntryFeaturedCheckbox } from "@/features/entries/components/DailyEntry/components/DailyEntryFeaturedCheckbox/DailyEntryFeaturedCheckbox.tsx";
import { LinkGoalsPopover } from "@/features/entries/components/LinkGoalsPopover/LinkGoalsPopover.tsx";
import { Entry } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";
import { ISODateString } from "@/types/ISODateString";

type DailyEntryProps = {
    id: string;
    entry: Entry;
    onNavigateUp: (column: DailyEntryColumn) => void;
    onNavigateDown: (column: DailyEntryColumn) => void;
    onFocusColumn: (column: DailyEntryColumn) => void;
    onSaveContent: (entryId: string, content: string) => void;
    onChangeDate: (entryId: string, date: ISODateString) => Promise<unknown>;
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
    onChangeDate,
    onChangeIsFeatured,
    onFocusColumn,
}: DailyEntryProps) => {
    const t = useTranslate();
    const [isGoalsPopoverOpen, setGoalsPopoverChange] = useState(false);

    const openGoalsPopover = () => {
        setGoalsPopoverChange(true);
    };

    return (
        <DailyEntryWrapper id={id}>
            <div className={classNames(styles.row)}>
                <DailyEntryContextMenu
                    onChangeDate={(date) => onChangeDate(entry.id, date)}
                    onOpenGoals={openGoalsPopover}
                    entry={entry}
                    onDelete={() => onDelete(entry.id)}
                    onChangeStatus={(value) => onChangeStatus(entry.id, value)}
                    onChangeIsFeatured={(value) => onChangeIsFeatured(entry.id, value)}
                >
                    <LinkGoalsPopover entryId={entry.id} isOpen={isGoalsPopoverOpen} onOpenChange={setGoalsPopoverChange}>
                        <DailyEntryContextMenuTrigger column="actions" onNavigateRight={() => onFocusColumn("checkbox")} />
                    </LinkGoalsPopover>
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
                    onNavigateRight={() => onFocusColumn("input")}
                    onNavigateUp={() => onNavigateUp("featured")}
                    onNavigateDown={() => onNavigateDown("featured")}
                    onChange={(isFeatured) => onChangeIsFeatured(entry.id, isFeatured)}
                    value={entry.isFeatured}
                />

                <DailyEntryInput
                    column="input"
                    initialContent={entry.content}
                    onNavigateUp={() => onNavigateUp("input")}
                    onNavigateDown={() => onNavigateDown("input")}
                    onNavigateLeft={() => onFocusColumn("featured")}
                    onSaveContent={(content) => onSaveContent(entry.id, content)}
                    onDelete={() => onDelete(entry.id)}
                    placeholder={t("entries.placeholder")}
                />
            </div>
        </DailyEntryWrapper>
    );
};
