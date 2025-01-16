import { DailyEntryWrapper } from "@/features/entries/components/DailyEntry/components/DaileEntryWrapper/DailyEntryWrapper";
import { DailyEntryInput } from "@/features/entries/components/DailyEntry/components/DailyEntryInput/DailyEntryInput";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type DailyEntryPlaceholderProps = {
    id: string;
    onNavigateUp: () => void;
    onNavigateDown: () => void;
    onSaveContent: (content: string) => void;
    onDelete: () => void;
};

export const DailyEntryPlaceholder = ({ onSaveContent, onDelete, onNavigateUp, onNavigateDown, id }: DailyEntryPlaceholderProps) => {
    const t = useTranslate();

    return (
        <DailyEntryWrapper id={id}>
            <DailyEntryInput
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
