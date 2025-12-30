import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("export");

export const EXPORT_EVENTS = {
    started: label("started"),
    cancelled: label("cancelled"),
    completed: label("completed"),
    batch: {
        ready: label("batch.ready"),
    },
};
