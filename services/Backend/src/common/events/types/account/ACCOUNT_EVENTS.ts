import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("account");

export const ACCOUNT_EVENTS = {
    suspended: label("suspended"),
    created: label("created"),

    activation: {
        completed: label("activation.completed"),
        requested: label("activation.requested"),
    },
    password: {
        resetRequested: label("password_reset.requested"),
        updated: label("password.updated"),
    },
    removal: {
        requested: label("removal.requested"),
        scheduled: label("removal.scheduled"),
        completed: label("removal.completed"),
    },
};
