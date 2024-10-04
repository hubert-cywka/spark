import { ifError } from "@hcywka/common";
import {
    PUBSUB_TOPICS,
    UserActivationTokenRequestedEventPayload,
    UserRequestedPasswordResetEventPayload,
} from "@hcywka/pubsub";
import { Controller, Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventPattern, Payload } from "@nestjs/microservices";

import { EmailDeliveryError } from "@/mail/errors/EmailDelivery.error";
import { IMailerService, IMailerServiceToken } from "@/mail/services/interfaces/IMailer.service";
import { PasswordResetRequestedEmail } from "@/mail/templates/PasswordResetRequestedEmail";
import { UserActivationEmail } from "@/mail/templates/UserActivationEmail";

@Controller()
export class UserSubscriber {
    private readonly logger = new Logger();

    public constructor(
        @Inject(IMailerServiceToken) private mailer: IMailerService,
        private configService: ConfigService
    ) {}

    @EventPattern(PUBSUB_TOPICS.user.activationTokenRequested)
    public async onUserActivationTokenRequested(@Payload() payload: UserActivationTokenRequestedEventPayload) {
        this.logger.log({ topic: PUBSUB_TOPICS.user.activationTokenRequested, payload }, "Received an event.");

        const template = new UserActivationEmail(
            payload.activationToken,
            this.configService.getOrThrow<string>("appUrl")
        );

        try {
            await this.mailer.send(payload.email, template);
        } catch (e) {
            ifError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }

    @EventPattern(PUBSUB_TOPICS.user.passwordResetRequested)
    public async onPasswordResetRequested(@Payload() payload: UserRequestedPasswordResetEventPayload) {
        this.logger.log({ topic: PUBSUB_TOPICS.user.passwordResetRequested, payload }, "Received an event.");

        const template = new PasswordResetRequestedEmail(
            payload.passwordResetToken,
            this.configService.getOrThrow<string>("appUrl")
        );

        try {
            await this.mailer.send(payload.email, template);
        } catch (e) {
            ifError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
