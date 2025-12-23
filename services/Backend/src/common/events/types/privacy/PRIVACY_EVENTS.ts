import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("privacy");

export const PRIVACY_EVENTS = {
    purge: {
        triggered: label("purge.triggered"),
    },
};
