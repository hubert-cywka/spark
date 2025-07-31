import { Inject, Injectable } from "@nestjs/common";

import { AccountActivatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
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

    public canHandle(subject: string): boolean {
        return subject === IntegrationEvents.account.activation.completed.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountActivatedEventPayload;
        await this.service.enableDefaultIntegrations(payload.account.id);
    }
}
