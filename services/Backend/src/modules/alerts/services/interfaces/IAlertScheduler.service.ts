import { type UTCDay } from "@/modules/alerts/types/UTCDay";

export const AlertSchedulerServiceToken = Symbol("AlertSchedulerService");

export interface IAlertSchedulerService {
    scheduleNextTrigger(time: string, daysOfWeek: UTCDay[]): Date | null;
}
