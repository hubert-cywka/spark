import { ifError } from "@hcywka/common";
import { PUBSUB_TOPICS, UserActivatedEventPayload, UserRegisteredEventPayload } from "@hcywka/pubsub";
import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";
import { IUsersService, IUsersServiceToken } from "@/users/services/interfaces/IUsers.service";

@Controller()
export class UsersSubscriber {
    private readonly logger = new Logger();

    public constructor(@Inject(IUsersServiceToken) private usersService: IUsersService) {}

    @EventPattern(PUBSUB_TOPICS.user.registered)
    async onUserRegistered(@Payload() payload: UserRegisteredEventPayload) {
        this.logger.log({ payload }, `Received ${PUBSUB_TOPICS.user.registered} event.`);
        const { user } = payload;

        try {
            await this.usersService.create(user.id, user.email);
        } catch (e) {
            ifError(e).is(EntityAlreadyExistsError).throwRpcException("User already exists.").elseRethrow();
        }
    }

    @EventPattern(PUBSUB_TOPICS.user.activated)
    async onUserActivated(@Payload() payload: UserActivatedEventPayload) {
        this.logger.log({ payload }, `Received ${PUBSUB_TOPICS.user.activated} event.`);
        const { user } = payload;

        try {
            await this.usersService.activate(user.id);
        } catch (e) {
            ifError(e).is(EntityAlreadyExistsError).throwRpcException("User already exists.").elseRethrow();
        }
    }
}
