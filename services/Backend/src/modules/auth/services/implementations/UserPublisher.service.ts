import { Inject } from "@nestjs/common";

import {
    IPublisherServiceToken,
    PublisherService,
    UserActivatedEvent,
    UserActivationTokenRequestedEvent,
    UserRequestedPasswordResetEvent,
} from "@/common/pubsub";
import { User } from "@/modules/auth/models/User.model";
import { IUserPublisherService } from "@/modules/auth/services/interfaces/IUserPublisher.service";

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

    public onPasswordResetRequested(email: string, passwordResetToken: string) {
        this.publisher.publish(new UserRequestedPasswordResetEvent({ email, passwordResetToken }));
    }
}
