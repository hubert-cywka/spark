import { type UTCDay } from "@/modules/alerts/types/UTCDay";

export const AlertSchedulerServiceToken = Symbol("AlertSchedulerService");

export interface IAlertSchedulerService {
    findNextTriggerTime(time: string, daysOfWeek: UTCDay[]): Date | null;
}
