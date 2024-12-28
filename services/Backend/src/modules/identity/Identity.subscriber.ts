import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { type AccountPasswordUpdatedEventPayload, IntegrationEventTopics } from "@/common/events";
import { EventInboxToken, IEventInbox } from "@/common/events/services/IEventInbox";
import {
    type IRefreshTokenService,
    IRefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";

@Controller()
export class IdentitySubscriber {
    private readonly logger = new Logger(IdentitySubscriber.name);

    public constructor(
        @Inject(IRefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService,
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox
    ) {}

    @EventPattern(IntegrationEventTopics.account.passwordUpdated)
    public async onPasswordUpdated(@Payload() payload: AccountPasswordUpdatedEventPayload) {
        this.logger.log({ topic: IntegrationEventTopics.account.passwordUpdated, payload }, "Received an event.");
        await this.refreshTokenService.invalidateAllByOwnerId(payload.id);
    }
}
