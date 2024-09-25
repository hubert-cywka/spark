import { PUBSUB_TOPICS, UserActivatedEventPayload, UserRegisteredEventPayload } from "@hcywka/pubsub";
import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { IUsersService, IUsersServiceToken } from "@/users/services/interfaces/IUsers.service";

@Controller()
export class UsersSubscriber {
    private readonly logger = new Logger();

    public constructor(@Inject(IUsersServiceToken) private usersService: IUsersService) {}

    @EventPattern(PUBSUB_TOPICS.user.registered)
    async onUserRegistered(@Payload() payload: UserRegisteredEventPayload) {
        // TODO: Check if there is need to throw RPCException
        this.logger.log({ payload }, `Received ${PUBSUB_TOPICS.user.registered} event.`);
        const { user } = payload;
        await this.usersService.create(user.id, user.email);
    }

    @EventPattern(PUBSUB_TOPICS.user.activated)
    async onUserActivated(@Payload() payload: UserActivatedEventPayload) {
        // TODO: Check if there is need to throw RPCException
        this.logger.log({ payload }, `Received ${PUBSUB_TOPICS.user.activated} event.`);
        const { user } = payload;
        await this.usersService.activate(user.id);
    }
}
