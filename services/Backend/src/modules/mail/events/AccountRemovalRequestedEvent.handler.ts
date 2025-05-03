import { Inject, Injectable } from "@nestjs/common";

import { whenError } from "@/common/errors/whenError";
import { type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { AccountRemovalRequestedEmail } from "@/modules/mail/templates/AccountRemovalRequestedEmail";

@Injectable()
export class AccountRemovalRequestedEventHandler implements IInboxEventHandler {
    public constructor(@Inject(MailerServiceToken) private mailer: IMailerService) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.requested;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = (await event.getPayload()) as AccountRemovalRequestedEventPayload;
        try {
            await this.mailer.send(payload.account.email, new AccountRemovalRequestedEmail());
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
