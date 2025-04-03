import { Inject, Injectable } from "@nestjs/common";

import { AccountActivatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import {
    type ITwoFactorAuthenticationMethodsProviderService,
    TwoFactorAuthenticationMethodsProviderServiceToken,
} from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationMethodsProvider.service";

@Injectable()
export class AccountActivatedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(TwoFactorAuthenticationMethodsProviderServiceToken)
        private readonly service: ITwoFactorAuthenticationMethodsProviderService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.activation.completed;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountActivatedEventPayload;
        await this.service.enableDefaultMethods(payload.id);
    }
}
