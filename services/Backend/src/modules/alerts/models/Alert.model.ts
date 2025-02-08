import { UTCDay } from "@/modules/alerts/types/UTCDay";

export type Alert = {
    id: string;
    enabled: boolean;
    recipientId: string;
    time: string;
    daysOfWeek: UTCDay[];
    nextTriggerAt: Date | null;
    createdAt: Date;
};
