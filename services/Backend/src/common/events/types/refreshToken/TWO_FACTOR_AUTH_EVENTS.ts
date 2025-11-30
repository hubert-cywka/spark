import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("refresh_token");

export const REFRESH_TOKEN_EVENTS = {
    invalidation: {
        triggered: label("invalidation.triggered"),
    },
};
