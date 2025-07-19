import { type UTCDay } from "@/modules/alerts/types/UTCDay";

export const AlertSchedulerServiceToken = Symbol("AlertSchedulerService");

export interface IAlertScheduler {
    scheduleNextTrigger(time: string, daysOfWeek: UTCDay[]): Date | null;
}
