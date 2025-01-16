import { DailyEntryWrapper } from "@/features/entries/components/DailyEntry/components/DaileEntryWrapper/DailyEntryWrapper";
import { DailyEntryCheckbox } from "@/features/entries/components/DailyEntry/components/DailyEntryCheckbox/DailyEntryCheckbox";
import { DailyEntryInput } from "@/features/entries/components/DailyEntry/components/DailyEntryInput/DailyEntryInput";
import { Entry } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type DailyEntryProps = {
    id: string;
    entry: Entry;
    onNavigateUp: (target: "checkbox" | "input") => void;
    onNavigateDown: (target: "checkbox" | "input") => void;
    onFocusCheckbox: () => void;
    onFocusInput: () => void;
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
    onFocusCheckbox,
    onFocusInput,
}: DailyEntryProps) => {
    const t = useTranslate();

    return (
        <DailyEntryWrapper id={id}>
            <DailyEntryCheckbox
                onNavigateRight={onFocusInput}
                onNavigateUp={() => onNavigateUp("checkbox")}
                onNavigateDown={() => onNavigateDown("checkbox")}
                onChange={(status) => onChangeStatus(entry, status)}
                value={entry.isCompleted}
            />
            <DailyEntryInput
                initialContent={entry.content}
                onNavigateUp={() => onNavigateUp("input")}
                onNavigateDown={() => onNavigateDown("input")}
                onNavigateLeft={onFocusCheckbox}
                onSaveContent={(content) => onSaveContent(entry, content)}
                onDelete={() => onDelete(entry.dailyId, entry.id)}
                placeholder={t("entries.placeholder")}
            />
        </DailyEntryWrapper>
    );
};
