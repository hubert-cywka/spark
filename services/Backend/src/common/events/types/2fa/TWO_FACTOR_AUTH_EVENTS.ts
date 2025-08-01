import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("2fa");

export const TWO_FACTOR_AUTH_EVENTS = {
    email: {
        issued: label("email.issued"),
    },
};
