import { type UTCDay } from "@/modules/alerts/types/UTCDay";

export const AlertSchedulerToken = Symbol("AlertScheduler");

export interface IAlertScheduler {
    scheduleNextTrigger(time: string, daysOfWeek: UTCDay[]): Date | null;
}
