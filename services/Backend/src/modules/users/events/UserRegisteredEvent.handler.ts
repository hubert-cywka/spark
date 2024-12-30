import { Inject, Injectable } from "@nestjs/common";

import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { whenError } from "@/common/errors/whenError";
import { AccountRegisteredEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Injectable()
export class UserRegisteredEventHandler implements IInboxEventHandler {
    public constructor(@Inject(UsersServiceToken) private readonly usersService: IUsersService) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.registered;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRegisteredEventPayload;
        try {
            await this.usersService.create(payload.account);
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("User already exists.").elseRethrow();
        }
    }
}
