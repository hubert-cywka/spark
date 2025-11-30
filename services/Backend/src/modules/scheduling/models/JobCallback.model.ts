import { IntegrationEventSubject, IntegrationEventTopic } from "@/common/events/types";

export type JobCallback = {
    topic: IntegrationEventTopic;
    subject: IntegrationEventSubject;
};
