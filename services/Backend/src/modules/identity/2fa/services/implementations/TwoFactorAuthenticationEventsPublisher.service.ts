import { Inject, Injectable } from "@nestjs/common";

import { EmailIntegrationTOTPIssuedEvent, EmailIntegrationTOTPIssuedEventPayload } from "@/common/events";
import { EventPublisherToken } from "@/common/events/services/interfaces/IEventPublisher";
import { type IEventPublisher } from "@/common/events/services/interfaces/IEventPublisher";
import { type ITwoFactorAuthenticationEventsPublisher } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationEventsPublisher.service";

@Injectable()
export class TwoFactorAuthenticationEventsPublisher implements ITwoFactorAuthenticationEventsPublisher {
    public constructor(
        @Inject(EventPublisherToken)
        private readonly publisher: IEventPublisher
    ) {}

    public async onTOTPIssued(tenantId: string, payload: EmailIntegrationTOTPIssuedEventPayload): Promise<void> {
        await this.publisher.enqueue(new EmailIntegrationTOTPIssuedEvent(tenantId, payload), { encrypt: true });
    }
}
