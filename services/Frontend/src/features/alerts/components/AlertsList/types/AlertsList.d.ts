import { Alert } from "@/features/alerts/types/Alert";
import { Day } from "@/types/Day.ts";

export type AddAlertRenderProps = {
    isDisabled: boolean;
};

export type AlertRenderProps = {
    alert: Alert;
    onUpdateStatus: (value: boolean) => void;
    onUpdateTime: (value: string) => void;
    onUpdateDays: (value: Day[]) => void;
    onDelete: () => void;
};
