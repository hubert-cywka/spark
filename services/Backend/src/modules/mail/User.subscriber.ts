import { Controller, Inject, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventPattern, Payload } from "@nestjs/microservices";

import { whenError } from "@/common/errors/whenError";
import {
    type AccountActivatedEventPayload,
    type AccountActivationTokenRequestedEventPayload,
    type AccountPasswordUpdatedEventPayload,
    type AccountRequestedPasswordResetEventPayload,
    IntegrationEventTopics,
} from "@/common/events";
import { EventInboxToken, IEventInbox } from "@/common/events/services/IEventInbox";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, IMailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { PasswordResetRequestedEmail } from "@/modules/mail/templates/PasswordResetRequestedEmail";
import { PasswordUpdatedEmail } from "@/modules/mail/templates/PasswordUpdatedEmail";
import { UserActivatedEmail } from "@/modules/mail/templates/UserActivatedEmail";
import { UserActivationEmail } from "@/modules/mail/templates/UserActivationEmail";

@Controller()
export class UserSubscriber {
    private readonly logger: Logger;
    private readonly appUrl: string;

    public constructor(
        @Inject(IMailerServiceToken) private mailer: IMailerService,
        private readonly configService: ConfigService,
        @Inject(EventInboxToken)
        private readonly inbox: IEventInbox
    ) {
        this.logger = new Logger(UserSubscriber.name);
        this.appUrl = configService.getOrThrow<string>("client.url.base");
    }

    @EventPattern(IntegrationEventTopics.account.activationTokenRequested)
    public async onUserActivationTokenRequested(@Payload() payload: AccountActivationTokenRequestedEventPayload) {
        this.logger.log(
            {
                topic: IntegrationEventTopics.account.activationTokenRequested,
                payload,
            },
            "Received an event."
        );

        try {
            const accountActivationPage = this.configService.getOrThrow<string>("client.url.accountActivationPage");
            const pageUrl = this.appUrl.concat(accountActivationPage);
            await this.mailer.send(payload.email, new UserActivationEmail(payload.activationToken, pageUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }

    @EventPattern(IntegrationEventTopics.account.passwordResetRequested)
    public async onPasswordResetRequested(@Payload() payload: AccountRequestedPasswordResetEventPayload) {
        this.logger.log(
            {
                topic: IntegrationEventTopics.account.passwordResetRequested,
                payload,
            },
            "Received an event."
        );

        try {
            const forgotPasswordPage = this.configService.getOrThrow<string>("client.url.forgotPasswordPage");
            const pageUrl = this.appUrl.concat(forgotPasswordPage);
            await this.mailer.send(payload.email, new PasswordResetRequestedEmail(payload.passwordResetToken, pageUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }

    @EventPattern(IntegrationEventTopics.account.passwordUpdated)
    public async onPasswordUpdated(@Payload() payload: AccountPasswordUpdatedEventPayload) {
        this.logger.log({ topic: IntegrationEventTopics.account.passwordUpdated, payload }, "Received an event.");

        try {
            await this.mailer.send(payload.email, new PasswordUpdatedEmail(this.appUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }

    @EventPattern(IntegrationEventTopics.account.activated)
    public async onUserActivated(@Payload() payload: AccountActivatedEventPayload) {
        this.logger.log({ topic: IntegrationEventTopics.account.activated, payload }, "Received an event.");

        try {
            await this.mailer.send(payload.email, new UserActivatedEmail(this.appUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
