import { Inject, Injectable } from "@nestjs/common";

import { AccountRegisteredEvent, AccountRegisteredEventPayload, EventPublisherService, IEventPublisherServiceToken } from "@/common/events";
import { type IAuthPublisherService } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";

@Injectable()
export class AuthPublisherService implements IAuthPublisherService {
    public constructor(
        @Inject(IEventPublisherServiceToken)
        private publisher: EventPublisherService
    ) {}

    public onAccountRegistered(payload: AccountRegisteredEventPayload): void {
        this.publisher.publish(new AccountRegisteredEvent(payload));
    }
}
