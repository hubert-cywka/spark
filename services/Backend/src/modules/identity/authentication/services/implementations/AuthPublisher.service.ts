import { Inject, Injectable } from "@nestjs/common";

import { AccountRegisteredEvent, AccountRegisteredEventPayload } from "@/common/events";
import { OutboxToken } from "@/common/events/services/IOutbox";
import { type IOutbox } from "@/common/events/services/IOutbox";
import { type IAuthPublisherService } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";

@Injectable()
export class AuthPublisherService implements IAuthPublisherService {
    public constructor(
        @Inject(OutboxToken)
        private readonly outbox: IOutbox
    ) {}

    public async onAccountRegistered(payload: AccountRegisteredEventPayload) {
        await this.outbox.enqueue(new AccountRegisteredEvent(payload));
    }
}
