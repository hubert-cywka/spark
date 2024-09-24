import { IPublisherServiceToken, PublisherService, UserActivatedEvent, UserRegisteredEvent } from "@hcywka/pubsub";
import { Inject } from "@nestjs/common";

import { IAuthMessagePublisherService } from "@/auth/services/interfaces/IAuthMessagePublisher.service";
import { User } from "@/user/models/User.model";

export class AuthMessagePublisherService implements IAuthMessagePublisherService {
    public constructor(
        @Inject(IPublisherServiceToken)
        private publisher: PublisherService
    ) {}

    public onUserRegistered(user: User, confirmationToken: string): void {
        this.publisher.publish(new UserRegisteredEvent(user, confirmationToken));
    }

    public onUserActivated(user: User): void {
        this.publisher.publish(new UserActivatedEvent(user));
    }
}
