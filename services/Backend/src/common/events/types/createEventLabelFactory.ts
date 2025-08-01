import { IntegrationEventLabel, IntegrationEventTopic } from "@/common/events/types";

export const createEventLabelFactory = (topic: IntegrationEventTopic): ((subject: string) => IntegrationEventLabel) => {
    return (subject: string) => ({
        subject: `${topic}.${subject}`,
        topic,
    });
};
