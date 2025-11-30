import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("scheduling");

export const SCHEDULING_EVENTS = {
    intervalJob: {
        updated: label("interval_job_schedule.updated"),
    },
};
