import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, AccountCreatedEventPayload, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { type ITenantService, TenantServiceToken } from "@/modules/privacy/services/interfaces/ITenantService";

@Injectable()
export class TenantCreatedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(TenantServiceToken)
        private readonly tenantService: ITenantService
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.account.created.subject;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountCreatedEventPayload;
        await this.tenantService.create(payload.account.id);
    }
}
