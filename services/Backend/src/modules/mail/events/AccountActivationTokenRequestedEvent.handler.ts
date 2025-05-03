import { Inject, Injectable } from "@nestjs/common";

import { whenError } from "@/common/errors/whenError";
import { AccountActivationTokenRequestedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { UserActivationEmail } from "@/modules/mail/templates/UserActivationEmail";

@Injectable()
export class AccountActivationTokenRequestedEventHandler implements IInboxEventHandler {
    constructor(@Inject(MailerServiceToken) private mailer: IMailerService) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.activation.requested;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = (await event.getPayload()) as AccountActivationTokenRequestedEventPayload;
        try {
            await this.mailer.send(payload.email, new UserActivationEmail(payload.redirectUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
