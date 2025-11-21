import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("configuration");

export const CONFIGURATION_EVENTS = {
    cronJobSchedule: {
        updated: label("cron_job_schedule.updated"),
    },
    intervalJobSchedule: {
        updated: label("interval_job_schedule.updated"),
    }
};
