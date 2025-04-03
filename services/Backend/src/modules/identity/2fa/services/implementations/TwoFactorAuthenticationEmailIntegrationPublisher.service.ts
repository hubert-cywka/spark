import { Inject, Injectable } from "@nestjs/common";

import { EmailIntegrationTOTPIssuedEvent, EmailIntegrationTOTPIssuedEventPayload } from "@/common/events";
import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { type ITwoFactorAuthenticationEmailIntegrationPublisherService } from "@/modules/identity/2fa/services/interfaces/ITwoFactorAuthenticationEmailIntegrationPublisher.service";

@Injectable()
export class TwoFactorAuthenticationEmailIntegrationPublisherService implements ITwoFactorAuthenticationEmailIntegrationPublisherService {
    public constructor(
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public async onTOTPIssued(tenantId: string, payload: EmailIntegrationTOTPIssuedEventPayload): Promise<void> {
        await this.outbox.enqueue(new EmailIntegrationTOTPIssuedEvent(tenantId, payload));
    }
}
