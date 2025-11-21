import { IntegrationEvent, IntegrationEvents } from "@/common/events";
import {JobScheduleUpdatedEventPayload} from "@/common/events/types/configuration/JobScheduleUpdatedEventPayload";

export type CronJobScheduleUpdatedEventPayload = JobScheduleUpdatedEventPayload<{
    cron: string;
}>;

export class JobScheduleUpdatedEvent extends IntegrationEvent<CronJobScheduleUpdatedEventPayload> {
    public constructor(payload: CronJobScheduleUpdatedEventPayload) {
        const topic = IntegrationEvents.configuration.cronJobSchedule.updated.topic;
        const subject = IntegrationEvents.configuration.cronJobSchedule.updated.subject;

        super({
            topic,
            subject,
            partitionKey: payload.jobId,
            payload,
        });
    }
}
