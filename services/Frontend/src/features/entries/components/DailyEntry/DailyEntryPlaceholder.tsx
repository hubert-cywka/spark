import { DailyEntryInput } from "@/features/entries/components/DailyEntry/components/DailyEntryInput/DailyEntryInput";
import { DailyEntryWrapper } from "@/features/entries/components/DailyEntry/components/DailyEntryWrapper/DailyEntryWrapper";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type DailyEntryPlaceholderProps = {
    id: string;
    onNavigateUp?: () => void;
    onNavigateDown?: () => void;
    onSaveContent: (content: string) => void;
    onDelete: () => void;
};

export const DailyEntryPlaceholder = ({ onSaveContent, onDelete, onNavigateUp, onNavigateDown, id }: DailyEntryPlaceholderProps) => {
    const t = useTranslate();

    return (
        <DailyEntryWrapper id={id}>
            <DailyEntryInput
                column="input"
                initialContent=""
                onNavigateUp={onNavigateUp}
                onNavigateDown={onNavigateDown}
                onSaveContent={onSaveContent}
                onDelete={onDelete}
                placeholder={t("entries.placeholder")}
            />
        </DailyEntryWrapper>
    );
};
