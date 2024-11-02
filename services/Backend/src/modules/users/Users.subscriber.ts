import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EntityConflictError } from "@/common/errors/EntityConflictError";
import { whenError } from "@/common/errors/whenError";
import { AccountActivatedEventPayload, AccountRegisteredEventPayload, EventTopics } from "@/common/events";
import { IUsersService, IUsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Controller()
export class UsersSubscriber {
    private readonly logger = new Logger(UsersSubscriber.name);

    public constructor(@Inject(IUsersServiceToken) private usersService: IUsersService) {}

    @EventPattern(EventTopics.account.registered)
    async onUserRegistered(@Payload() payload: AccountRegisteredEventPayload) {
        this.logger.log({ payload }, `Received ${EventTopics.account.registered} event.`);
        const { account } = payload;

        try {
            await this.usersService.create({
                id: account.id,
                email: account.email,
                lastName: account.lastName,
                firstName: account.firstName,
                isActivated: false,
            });
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("User already exists.").elseRethrow();
        }
    }

    @EventPattern(EventTopics.account.activated)
    async onUserActivated(@Payload() payload: AccountActivatedEventPayload) {
        this.logger.log({ payload }, `Received ${EventTopics.account.activated} event.`);
        const { id } = payload;

        try {
            await this.usersService.activate(id);
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("User already exists.").elseRethrow();
        }
    }
}
