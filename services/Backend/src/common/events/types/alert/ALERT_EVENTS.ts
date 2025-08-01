import { createEventLabelFactory } from "@/common/events/types/createEventLabelFactory";

const label = createEventLabelFactory("alert");

export const ALERT_EVENTS = {
    daily: {
        reminder: {
            triggered: label("daily.reminder.triggered"),
        },
    },
};
