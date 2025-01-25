import { Day } from "@/types/Day";

export type ChangeAlertTimeDto = {
    time: string;
    daysOfWeek: Day[];
};
