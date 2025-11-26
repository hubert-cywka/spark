import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("alert");

export const ALERT_EVENTS = {
    check: {
        triggered: label("check.triggered"),
    },
    daily: {
        reminder: {
            triggered: label("daily.reminder.triggered"),
        },
    },
};
