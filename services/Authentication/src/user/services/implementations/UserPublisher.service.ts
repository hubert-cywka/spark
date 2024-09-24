import {
    IPublisherServiceToken,
    PublisherService,
    UserActivatedEvent,
    UserActivationTokenRequestedEvent,
} from "@hcywka/pubsub";
import { Inject } from "@nestjs/common";

import { User } from "@/user/models/User.model";
import { IUserPublisherService } from "@/user/services/interfaces/IUserPublisher.service";

export class UserPublisherService implements IUserPublisherService {
    public constructor(
        @Inject(IPublisherServiceToken)
        private publisher: PublisherService
    ) {}

    public onUserActivated(user: User): void {
        this.publisher.publish(new UserActivatedEvent({ user }));
    }

    public onUserActivationTokenRequested(email: string, activationToken: string) {
        this.publisher.publish(new UserActivationTokenRequestedEvent({ email, activationToken }));
    }
}
