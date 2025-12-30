import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("purge");

export const PURGE_EVENTS = {
    triggered: label("triggered"),
};
