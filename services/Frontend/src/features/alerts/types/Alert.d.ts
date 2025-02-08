import { Day } from "@/types/Day";

export type Alert = {
    id: string;
    time: string;
    daysOfWeek: Day[];
    createdAt: Date;
    nextTriggerAt: Date;
    enabled: boolean;
};
