import { IntegrationEventSubject, IntegrationEventTopic } from "@/common/events/types";

export type JobScheduleUpdatedEventPayload<T extends object> = {
    id: string;
    callback: {
        topic: IntegrationEventTopic;
        subject: IntegrationEventSubject;
    };
} & T;
