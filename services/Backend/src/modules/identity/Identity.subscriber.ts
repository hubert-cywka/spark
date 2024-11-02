import { Controller, Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventPattern, Payload } from "@nestjs/microservices";

import { AccountPasswordUpdatedEventPayload, EventTopics } from "@/common/events";
import {
    IRefreshTokenService,
    IRefreshTokenServiceToken,
} from "@/modules/identity/authentication/services/interfaces/IRefreshToken.service";

@Controller()
export class IdentitySubscriber {
    private readonly logger = new Logger(IdentitySubscriber.name);

    public constructor(
        @Inject(IRefreshTokenServiceToken)
        private refreshTokenService: IRefreshTokenService,
        private configService: ConfigService
    ) {}

    @EventPattern(EventTopics.account.passwordUpdated)
    public async onPasswordUpdated(@Payload() payload: AccountPasswordUpdatedEventPayload) {
        this.logger.log({ topic: EventTopics.account.passwordUpdated, payload }, "Received an event.");
        await this.refreshTokenService.invalidateAllByOwnerId(payload.id);
    }
}
