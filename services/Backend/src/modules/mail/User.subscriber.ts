import { Controller, Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventPattern, Payload } from "@nestjs/microservices";

import { whenError } from "@/common/errors/whenError";
import { AccountActivationTokenRequestedEventPayload, AccountRequestedPasswordResetEventPayload, EventTopics } from "@/common/events";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { IMailerService, IMailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { PasswordResetRequestedEmail } from "@/modules/mail/templates/PasswordResetRequestedEmail";
import { UserActivationEmail } from "@/modules/mail/templates/UserActivationEmail";

@Controller()
export class UserSubscriber {
    private readonly logger = new Logger();

    public constructor(
        @Inject(IMailerServiceToken) private mailer: IMailerService,
        private configService: ConfigService
    ) {}

    @EventPattern(EventTopics.account.activationTokenRequested)
    public async onUserActivationTokenRequested(@Payload() payload: AccountActivationTokenRequestedEventPayload) {
        this.logger.log({ topic: EventTopics.account.activationTokenRequested, payload }, "Received an event.");

        const template = new UserActivationEmail(payload.activationToken, this.configService.getOrThrow<string>("appUrl"));

        try {
            await this.mailer.send(payload.email, template);
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }

    @EventPattern(EventTopics.account.passwordResetRequested)
    public async onPasswordResetRequested(@Payload() payload: AccountRequestedPasswordResetEventPayload) {
        this.logger.log({ topic: EventTopics.account.passwordResetRequested, payload }, "Received an event.");

        const template = new PasswordResetRequestedEmail(payload.passwordResetToken, this.configService.getOrThrow<string>("appUrl"));

        try {
            await this.mailer.send(payload.email, template);
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
