import { Inject, Injectable } from "@nestjs/common";

import { EntityConflictError } from "@/common/errors/EntityConflict.error";
import { whenError } from "@/common/errors/whenError";
import { AccountActivatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Injectable()
export class UserActivatedEventHandler implements IInboxEventHandler {
    constructor(@Inject(UsersServiceToken) private readonly usersService: IUsersService) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.activation.completed;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = (await event.getPayload()) as AccountActivatedEventPayload;
        try {
            await this.usersService.activateOneById(payload.id);
        } catch (e) {
            whenError(e).is(EntityConflictError).throwRpcException("User already activated.").elseRethrow();
        }
    }
}
