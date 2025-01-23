import { Weekday } from "@/modules/alerts/enums/Weekday.enum";

export type Alert = {
    id: string;
    enabled: boolean;
    recipientId: string;
    time: string;
    daysOfWeek: Weekday[];
    lastTriggeredAt: Date | null;
    createdAt: Date;
};
