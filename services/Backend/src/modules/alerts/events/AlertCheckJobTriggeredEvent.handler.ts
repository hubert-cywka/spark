import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { type IAlertsProcessor, AlertsProcessorToken } from "@/modules/alerts/services/interfaces/IAlertsProcessor";

@Injectable()
export class AlertCheckJobTriggeredEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(AlertsProcessorToken)
        private alertsProcessor: IAlertsProcessor
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.alert.check.triggered.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        await this.alertsProcessor.triggerPendingAlerts();
    }
}
