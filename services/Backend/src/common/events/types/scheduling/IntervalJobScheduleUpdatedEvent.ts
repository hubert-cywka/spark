import { IntegrationEvent, IntegrationEvents } from "@/common/events";
import { JobScheduleUpdatedEventPayload } from "@/common/events/types/scheduling/JobScheduleUpdatedEventPayload";

export type IntervalJobScheduleUpdatedEventPayload = JobScheduleUpdatedEventPayload<{
    interval: number;
}>;

export class IntervalJobScheduleUpdatedEvent extends IntegrationEvent<IntervalJobScheduleUpdatedEventPayload> {
    public constructor(payload: IntervalJobScheduleUpdatedEventPayload) {
        const topic = IntegrationEvents.scheduling.intervalJob.updated.topic;
        const subject = IntegrationEvents.scheduling.intervalJob.updated.subject;

        super({
            tenantId: null,
            topic,
            subject,
            partitionKey: payload.id,
            payload,
        });
    }
}
