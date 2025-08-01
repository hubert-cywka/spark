import { Inject, Injectable } from "@nestjs/common";

import { AccountActivatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { IntegrationEventSubject } from "@/common/events/types";
import { type IMailSender, MailSenderToken } from "@/modules/mail/services/interfaces/IMailSender.service";
import { type IRecipientService, RecipientServiceToken } from "@/modules/mail/services/interfaces/IRecipient.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class AccountActivatedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(MailSenderToken) private mailer: IMailSender,
        @Inject(RecipientServiceToken)
        private recipientService: IRecipientService,
        @Inject(EmailTemplateFactoryToken)
        private emailFactory: IEmailTemplateFactory
    ) {}

    public canHandle(subject: IntegrationEventSubject): boolean {
        return subject === IntegrationEvents.account.activation.completed.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountActivatedEventPayload;
        await this.recipientService.create(payload.account.id, payload.account.email);
        await this.mailer.send(payload.account.email, this.emailFactory.createUserActivatedEmail());
    }
}
