import { Alert } from "@/features/alerts/types/Alert";
import { TranslationFn } from "@/lib/i18n/i18n";
import { Day } from "@/types/Day.ts";

export type AddAlertRenderProps = {
    isDisabled: boolean;
};

export type AlertRenderProps = {
    alert: Alert;
    translateFn: TranslationFn;
    onUpdateStatus: (value: boolean) => void;
    onUpdateTime: (value: string) => void;
    onUpdateDays: (value: Day[]) => void;
    onDelete: () => void;
};
