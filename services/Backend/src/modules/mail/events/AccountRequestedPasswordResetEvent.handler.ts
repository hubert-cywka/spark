import { Inject, Injectable } from "@nestjs/common";

import { whenError } from "@/common/errors/whenError";
import { AccountRequestedPasswordResetEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { PasswordResetRequestedEmail } from "@/modules/mail/templates/PasswordResetRequestedEmail";

@Injectable()
export class AccountRequestedPasswordResetEventHandler implements IInboxEventHandler {
    constructor(@Inject(MailerServiceToken) private mailer: IMailerService) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.password.resetRequested;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = (await event.getPayload()) as AccountRequestedPasswordResetEventPayload;
        try {
            await this.mailer.send(payload.email, new PasswordResetRequestedEmail(payload.redirectUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
