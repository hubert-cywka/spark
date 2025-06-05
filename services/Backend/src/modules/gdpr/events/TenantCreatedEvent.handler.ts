import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, AccountCreatedEventPayload, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type ITenantService, TenantServiceToken } from "@/modules/gdpr/services/interfaces/ITenant.service";

@Injectable()
export class TenantCreatedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(TenantServiceToken)
        private readonly tenantService: ITenantService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.created;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountCreatedEventPayload;
        await this.tenantService.create(payload.account.id);
    }
}
