import { Inject, Injectable } from "@nestjs/common";

import { Email2FACodeIssuedEvent, Email2FACodeIssuedEventPayload } from "@/common/events";
import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { type ITwoFactorAuthenticationPublisherService } from "@/modules/identity/authentication/services/interfaces/ITwoFactorAuthenticationPublisher.service";

@Injectable()
export class TwoFactorAuthenticationPublisherService implements ITwoFactorAuthenticationPublisherService {
    public constructor(
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public async onEmail2FACodeIssued(tenantId: string, payload: Email2FACodeIssuedEventPayload): Promise<void> {
        await this.outbox.enqueue(new Email2FACodeIssuedEvent(tenantId, payload));
    }
}
