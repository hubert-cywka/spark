import { Inject, Injectable } from "@nestjs/common";

import { AccountRegisteredEvent, AccountRegisteredEventPayload } from "@/common/events";
import { EventOutboxToken } from "@/common/events/services/interfaces/IEventOutbox";
import { type IEventOutbox } from "@/common/events/services/interfaces/IEventOutbox";
import { type IAuthPublisherService } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";

@Injectable()
export class AuthPublisherService implements IAuthPublisherService {
    public constructor(
        @Inject(EventOutboxToken)
        private readonly outbox: IEventOutbox
    ) {}

    public async onAccountRegistered(payload: AccountRegisteredEventPayload) {
        await this.outbox.enqueue(new AccountRegisteredEvent(payload));
    }
}
