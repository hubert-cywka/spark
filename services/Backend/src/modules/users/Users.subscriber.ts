import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { whenError } from "@/common/errors/whenError";
import { AccountActivatedEvent, AccountRegisteredEvent, IntegrationEventTopics } from "@/common/events";
import { type IEventInbox, EventInboxToken } from "@/common/events/services/IEventInbox";
import { HydratePipe } from "@/common/pipes/Hydrate.pipe";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Controller()
export class UsersSubscriber {
    private readonly logger = new Logger(UsersSubscriber.name);

    public constructor(
        @Inject(UsersServiceToken)
        private readonly usersService: IUsersService,
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox
    ) {}

    @EventPattern(IntegrationEventTopics.account.registered)
    async onUserRegistered(
        @Payload(new HydratePipe(AccountRegisteredEvent))
        event: AccountRegisteredEvent
    ) {
        const payload = event.getPayload();
        this.logger.log({ payload }, `Received ${IntegrationEventTopics.account.registered} event.`);
        const { account } = payload;

        try {
            await this.usersService.create(account);
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("User already exists.").elseRethrow();
        }
    }

    @EventPattern(IntegrationEventTopics.account.activated)
    async onUserActivated(
        @Payload(new HydratePipe(AccountActivatedEvent))
        event: AccountActivatedEvent
    ) {
        const payload = event.getPayload();
        this.logger.log({ payload }, `Received ${IntegrationEventTopics.account.activated} event.`);
        const { id } = payload;

        try {
            await this.usersService.activate(id);
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("User already exists.").elseRethrow();
        }
    }
}
