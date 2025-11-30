import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("gdpr");

export const GDPR_EVENTS = {
    purge: {
        triggered: label("purge.triggered"),
    },
};
