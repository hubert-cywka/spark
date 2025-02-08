import { Day } from "@/types/Day";

export type AlertDto = {
    id: string;
    time: string;
    daysOfWeek: Day[];
    createdAt: string;
    nextTriggerAt: string;
    enabled: boolean;
};
