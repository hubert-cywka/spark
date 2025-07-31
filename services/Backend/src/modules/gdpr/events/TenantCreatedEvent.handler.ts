import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, AccountCreatedEventPayload, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { type ITenantService, TenantServiceToken } from "@/modules/gdpr/services/interfaces/ITenant.service";

@Injectable()
export class TenantCreatedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(TenantServiceToken)
        private readonly tenantService: ITenantService
    ) {}

    public canHandle(subject: string): boolean {
        return subject === IntegrationEvents.account.created.subject;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountCreatedEventPayload;
        await this.tenantService.create(payload.account.id);
    }
}
