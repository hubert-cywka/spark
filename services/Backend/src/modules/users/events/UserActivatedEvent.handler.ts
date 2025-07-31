import { Inject, Injectable } from "@nestjs/common";

import { AccountActivatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { type IUsersService, UsersServiceToken } from "@/modules/users/services/interfaces/IUsers.service";

@Injectable()
export class UserActivatedEventHandler implements IInboxEventHandler {
    constructor(@Inject(UsersServiceToken) private readonly usersService: IUsersService) {}

    public canHandle(subject: string): boolean {
        return subject === IntegrationEvents.account.activation.completed.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountActivatedEventPayload;
        await this.usersService.activateOneById(payload.account.id);
    }
}
