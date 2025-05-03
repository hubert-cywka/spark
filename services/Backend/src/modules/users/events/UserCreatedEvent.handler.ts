import { Inject, Injectable } from "@nestjs/common";

import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { whenError } from "@/common/errors/whenError";
import { AccountCreatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Injectable()
export class UserCreatedEventHandler implements IInboxEventHandler {
    public constructor(@Inject(UsersServiceToken) private readonly usersService: IUsersService) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.created;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = (await event.getPayload()) as AccountCreatedEventPayload;
        try {
            await this.usersService.create({
                id: payload.id,
                email: payload.email,
            });
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("User already exists.").elseRethrow();
        }
    }
}
