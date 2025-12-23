import { Inject, Injectable } from "@nestjs/common";

import { AccountActivatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import {
    type ITwoFactorAuthenticationIntegrationsProvider,
    TwoFactorAuthenticationMethodsProviderToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationIntegrationsProvider";

@Injectable()
export class AccountActivatedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(TwoFactorAuthenticationMethodsProviderToken)
        private readonly service: ITwoFactorAuthenticationIntegrationsProvider
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.account.activation.completed.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountActivatedEventPayload;
        await this.service.enableDefaultIntegrations(payload.account.id);
    }
}
