import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import {
    type IRefreshTokenService,
    RefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";

@Injectable()
export class RefreshTokenInvalidationJobTriggeredEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(RefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.refreshToken.invalidation.triggered.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        await this.refreshTokenService.deleteAllExpired();
    }
}
