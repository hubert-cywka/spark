import {IntegrationEvent, IntegrationEvents} from "@/common/events";
import {JobScheduleUpdatedEventPayload} from "@/common/events/types/configuration/JobScheduleUpdatedEventPayload";

export type IntervalJobScheduleUpdatedEventPayload = JobScheduleUpdatedEventPayload<{
    interval: number;
}>;

export class IntervalJobScheduleUpdatedEvent extends IntegrationEvent<IntervalJobScheduleUpdatedEventPayload> {
    public constructor(payload: IntervalJobScheduleUpdatedEventPayload) {
        const topic = IntegrationEvents.configuration.intervalJobSchedule.updated.topic;
        const subject = IntegrationEvents.configuration.intervalJobSchedule.updated.subject;

        super({
            topic,
            subject,
            partitionKey: payload.jobId,
            payload,
        });
    }
}
