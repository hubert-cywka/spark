import { Inject, Injectable } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { JobTriggeredEvent } from "@/common/events/types/scheduling/JobTriggeredEvent";
import {
    type IRefreshTokenService,
    RefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshTokenService";

@Injectable()
export class RefreshTokenInvalidationJobTriggeredEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(RefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.refreshToken.invalidation.triggered.subject;
    }

    public async handle(event: JobTriggeredEvent): Promise<void> {
        await this.refreshTokenService.deleteAllExpired();
    }
}
