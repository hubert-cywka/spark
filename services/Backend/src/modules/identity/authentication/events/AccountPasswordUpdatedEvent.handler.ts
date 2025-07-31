import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, AccountPasswordUpdatedEventPayload, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import {
    type IRefreshTokenService,
    RefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";

@Injectable()
export class AccountPasswordUpdatedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(RefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.account.password.updated.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountPasswordUpdatedEventPayload;
        await this.refreshTokenService.invalidateAllByOwnerId(payload.account.id);
    }
}
