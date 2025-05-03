import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";
import { type IDataPurgeService, DataPurgeServiceToken } from "@/modules/gdpr/services/interfaces/IDataPurge.service";

@Injectable()
export class TenantRemovalRequestedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(DataPurgeServiceToken)
        private readonly dataPurgeService: IDataPurgeService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.requested;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = (await event.getPayload()) as AccountRemovalRequestedEventPayload;
        await this.dataPurgeService.scheduleForTenant(payload.account.id);
    }
}
