import { Inject, Injectable } from "@nestjs/common";

import { AccountActivationTokenRequestedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type IMailSender, MailSenderToken } from "@/modules/mail/services/interfaces/IMailSender.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class AccountActivationTokenRequestedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(MailSenderToken) private mailer: IMailSender,
        @Inject(EmailTemplateFactoryToken)
        private emailFactory: IEmailTemplateFactory
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.activation.requested;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountActivationTokenRequestedEventPayload;
        await this.mailer.send(payload.account.email, this.emailFactory.createUserActivationEmail(payload.redirectUrl));
    }
}
