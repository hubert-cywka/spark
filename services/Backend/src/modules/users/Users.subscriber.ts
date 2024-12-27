import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { whenError } from "@/common/errors/whenError";
import { type AccountActivatedEventPayload, type AccountRegisteredEventPayload, IntegrationEventTopics } from "@/common/events";
import { type IUsersService, IUsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Controller()
export class UsersSubscriber {
    private readonly logger = new Logger(UsersSubscriber.name);

    public constructor(@Inject(IUsersServiceToken) private usersService: IUsersService) {}

    @EventPattern(IntegrationEventTopics.account.registered)
    async onUserRegistered(@Payload() payload: AccountRegisteredEventPayload) {
        this.logger.log({ payload }, `Received ${IntegrationEventTopics.account.registered} event.`);
        const { account } = payload;

        try {
            await this.usersService.create(account);
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("User already exists.").elseRethrow();
        }
    }

    @EventPattern(IntegrationEventTopics.account.activated)
    async onUserActivated(@Payload() payload: AccountActivatedEventPayload) {
        this.logger.log({ payload }, `Received ${IntegrationEventTopics.account.activated} event.`);
        const { id } = payload;

        try {
            await this.usersService.activate(id);
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("User already exists.").elseRethrow();
        }
    }
}
