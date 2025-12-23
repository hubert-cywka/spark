import { Inject, Injectable } from "@nestjs/common";

import { IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { IntervalJobScheduleUpdatedEventPayload } from "@/common/events/types/scheduling/IntervalJobScheduleUpdatedEvent";
import {
    type IJobScheduleConfigurationService,
    JobScheduleConfigurationServiceToken,
} from "@/modules/scheduling/services/interfaces/IJobScheduleConfigurationService";

@Injectable()
export class IntervalJobScheduleUpdatedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(JobScheduleConfigurationServiceToken)
        private readonly scheduleConfigurationService: IJobScheduleConfigurationService
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.scheduling.intervalJob.updated.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as IntervalJobScheduleUpdatedEventPayload;
        await this.scheduleConfigurationService.upsert(payload.id, payload.interval, payload.callback);
    }
}
