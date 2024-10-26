import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EntityAlreadyExistsError } from "@/common/errors/EntityAlreadyExists.error";
import { whenError } from "@/common/errors/whenError";
import { AccountActivatedEventPayload, AccountRegisteredEventPayload, EventTopics } from "@/common/events";
import { IUsersService, IUsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Controller()
export class UsersSubscriber {
    private readonly logger = new Logger();

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
            whenError(e).is(EntityAlreadyExistsError).throwRpcException("User already exists.").elseRethrow();
        }
    }

    @EventPattern(EventTopics.account.activated)
    async onUserActivated(@Payload() payload: AccountActivatedEventPayload) {
        this.logger.log({ payload }, `Received ${EventTopics.account.activated} event.`);
        const { account } = payload;

        try {
            await this.usersService.activate(account.id);
        } catch (e) {
            whenError(e).is(EntityAlreadyExistsError).throwRpcException("User already exists.").elseRethrow();
        }
    }
}
