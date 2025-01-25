import { Day } from "@/types/Day";

export type CreateAlertDto = {
    time: string;
    daysOfWeek: Day[];
};
