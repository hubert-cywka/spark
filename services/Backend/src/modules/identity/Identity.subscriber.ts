import { Controller, Inject, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

import { AccountPasswordUpdatedEvent, IntegrationEventTopics } from "@/common/events";
import { type IEventInbox, EventInboxToken } from "@/common/events/services/IEventInbox";
import { HydratePipe } from "@/common/pipes/Hydrate.pipe";
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
    public async onPasswordUpdated(
        @Payload(new HydratePipe(AccountPasswordUpdatedEvent))
        event: AccountPasswordUpdatedEvent
    ) {
        const payload = event.getPayload();
        this.logger.log({ topic: IntegrationEventTopics.account.passwordUpdated, payload }, "Received an event.");
        await this.refreshTokenService.invalidateAllByOwnerId(payload.id);
    }
}
