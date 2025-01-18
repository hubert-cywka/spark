import { Popover } from "@/components/Popover";
import { DailyEntryColumn } from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries";
import { DailyEntryCheckbox } from "@/features/entries/components/DailyEntry/components/DailyEntryCheckbox/DailyEntryCheckbox";
import { DailyEntryGoalsTrigger } from "@/features/entries/components/DailyEntry/components/DailyEntryGoalsTrigger/DailyEntryGoalsTrigger";
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

    return (
        <DailyEntryWrapper id={id}>
            <Popover
                trigger={
                    <DailyEntryGoalsTrigger
                        column="goals"
                        onNavigateRight={() => onFocusColumn("checkbox")}
                        onNavigateUp={() => onNavigateUp("goals")}
                        onNavigateDown={() => onNavigateDown("goals")}
                    />
                }
            >
                <EntryGoalsList entryId={entry.id} />
            </Popover>

            <DailyEntryCheckbox
                column="checkbox"
                onNavigateLeft={() => onFocusColumn("goals")}
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
        </DailyEntryWrapper>
    );
};
