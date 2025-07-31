import { Inject, Injectable } from "@nestjs/common";

import { AccountCreatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Injectable()
export class UserCreatedEventHandler implements IInboxEventHandler {
    public constructor(@Inject(UsersServiceToken) private readonly usersService: IUsersService) {}

    public canHandle(subject: string): boolean {
        return subject === IntegrationEvents.account.created.subject;
    }

    async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountCreatedEventPayload;
        await this.usersService.create({
            id: payload.account.id,
            email: payload.account.email,
        });
    }
}
