import { Inject, Injectable } from "@nestjs/common";

import { AccountRegisteredEvent, AccountRegisteredEventPayload, IPublisherServiceToken, PublisherService } from "@/common/events";
import { type IAuthPublisherService } from "@/modules/identity/authentication/services/interfaces/IAuthPublisher.service";

@Injectable()
export class AuthPublisherService implements IAuthPublisherService {
    public constructor(
        @Inject(IPublisherServiceToken)
        private publisher: PublisherService
    ) {}

    public onAccountRegistered(payload: AccountRegisteredEventPayload): void {
        this.publisher.publish(new AccountRegisteredEvent(payload));
    }
}
