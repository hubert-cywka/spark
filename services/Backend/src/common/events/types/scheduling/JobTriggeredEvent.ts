import { IntegrationEvent } from "@/common/events";
import { IntegrationEventSubject, IntegrationEventTopic } from "@/common/events/types";

export type JobTriggeredEventPayload = {
    job: {
        id: string;
        callback: {
            topic: string;
            subject: string;
        };
    };
};

export class JobTriggeredEvent extends IntegrationEvent<JobTriggeredEventPayload> {
    public constructor(payload: JobTriggeredEventPayload) {
        super({
            tenantId: "", // TODO
            topic: payload.job.callback.topic as unknown as IntegrationEventTopic,
            subject: payload.job.callback.subject as unknown as IntegrationEventSubject,
            partitionKey: payload.job.id,
            payload,
        });
    }
}
