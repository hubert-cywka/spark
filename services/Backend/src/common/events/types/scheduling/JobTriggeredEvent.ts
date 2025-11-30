import { IntegrationEvent } from "@/common/events";
import { IntegrationEventSubject, IntegrationEventTopic } from "@/common/events/types";

export type JobTriggeredEventPayload = {
    job: {
        id: string;
        callback: {
            topic: IntegrationEventTopic;
            subject: IntegrationEventSubject;
        };
    };
};

export class JobTriggeredEvent extends IntegrationEvent<JobTriggeredEventPayload> {
    public constructor(payload: JobTriggeredEventPayload) {
        super({
            tenantId: null,
            topic: payload.job.callback.topic,
            subject: payload.job.callback.subject,
            partitionKey: payload.job.id,
            payload,
        });
    }
}
