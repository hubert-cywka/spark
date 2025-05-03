import { Inject, Injectable } from "@nestjs/common";

import { AccountActivatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import {
    type ITwoFactorAuthenticationIntegrationsProviderService,
    TwoFactorAuthenticationMethodsProviderServiceToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegrationsProvider.service";

@Injectable()
export class AccountActivatedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(TwoFactorAuthenticationMethodsProviderServiceToken)
        private readonly service: ITwoFactorAuthenticationIntegrationsProviderService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.activation.completed;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = (await event.getPayload()) as AccountActivatedEventPayload;
        await this.service.enableDefaultIntegrations(payload.id);
    }
}
