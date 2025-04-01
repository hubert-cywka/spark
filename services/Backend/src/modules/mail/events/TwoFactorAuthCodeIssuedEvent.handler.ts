import { Inject, Injectable } from "@nestjs/common";

import { whenError } from "@/common/errors/whenError";
import { Email2FACodeIssuedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { TwoFactorAuthCodeIssuedEmail } from "@/modules/mail/templates/TwoFactorAuthCodeIssuedEmail";

@Injectable()
export class TwoFactorAuthCodeIssuedEventHandler implements IInboxEventHandler {
    constructor(@Inject(MailerServiceToken) private mailer: IMailerService) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.twoFactorAuth.email.issued;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as Email2FACodeIssuedEventPayload;
        try {
            await this.mailer.send(payload.email, new TwoFactorAuthCodeIssuedEmail(payload.code));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
