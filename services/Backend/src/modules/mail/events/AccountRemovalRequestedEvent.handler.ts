import { Inject, Injectable } from "@nestjs/common";

import { whenError } from "@/common/errors/whenError";
import { type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class AccountRemovalRequestedEventHandler<T> implements IInboxEventHandler {
    public constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService<T>,
        @Inject(EmailTemplateFactoryToken)
        private emailFactory: IEmailTemplateFactory<T>
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.requested;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalRequestedEventPayload;
        try {
            await this.mailer.send(payload.account.email, this.emailFactory.createAccountRemovalRequestedEmail(payload.retentionPeriod));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
