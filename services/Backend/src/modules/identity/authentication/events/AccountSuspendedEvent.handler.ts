import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { AccountSuspendedEventPayload } from "@/common/events/types/account/AccountSuspendedEvent";
import {
    type IRefreshTokenService,
    RefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";

@Injectable()
export class AccountSuspendedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(RefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService
    ) {}

    public canHandle(subject: string): boolean {
        return subject === IntegrationEvents.account.suspended.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountSuspendedEventPayload;
        await this.refreshTokenService.invalidateAllByOwnerId(payload.account.id);
    }
}
