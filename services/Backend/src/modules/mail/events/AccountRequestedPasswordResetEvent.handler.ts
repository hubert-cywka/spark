import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { whenError } from "@/common/errors/whenError";
import { AccountRequestedPasswordResetEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, IMailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { PasswordResetRequestedEmail } from "@/modules/mail/templates/PasswordResetRequestedEmail";

@Injectable()
export class AccountRequestedPasswordResetEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(IMailerServiceToken) private mailer: IMailerService,
        private readonly configService: ConfigService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.password.resetRequested;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRequestedPasswordResetEventPayload;
        try {
            const forgotPasswordPage = this.configService.getOrThrow<string>("client.url.forgotPasswordPage");
            const appUrl = this.configService.getOrThrow<string>("client.url.base");
            const pageUrl = appUrl.concat(forgotPasswordPage);
            await this.mailer.send(payload.email, new PasswordResetRequestedEmail(payload.passwordResetToken, pageUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
