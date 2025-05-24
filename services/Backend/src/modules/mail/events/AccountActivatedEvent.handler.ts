import { Inject, Injectable } from "@nestjs/common";

import { AccountActivatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { type IRecipientService, RecipientServiceToken } from "@/modules/mail/services/interfaces/IRecipient.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class AccountActivatedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService,
        @Inject(RecipientServiceToken)
        private recipientService: IRecipientService,
        @Inject(EmailTemplateFactoryToken)
        private emailFactory: IEmailTemplateFactory
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.activation.completed;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountActivatedEventPayload;
        await this.recipientService.create(payload.account.id, payload.account.email);
        await this.mailer.send(payload.account.email, this.emailFactory.createUserActivatedEmail());
    }
}
