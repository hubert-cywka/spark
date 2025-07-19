import { Inject, Injectable } from "@nestjs/common";

import { IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type DailyReminderTriggeredEventPayload } from "@/common/events/types/alert/DailyReminderTriggeredEvent";
import { type IEmailLookup, EmailLookupToken } from "@/modules/mail/services/interfaces/IEmailLookup.service";
import { type IMailSender, MailSenderToken } from "@/modules/mail/services/interfaces/IMailSender.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class DailyReminderTriggeredEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(MailSenderToken) private mailer: IMailSender,
        @Inject(EmailLookupToken)
        private emailLookup: IEmailLookup,
        @Inject(EmailTemplateFactoryToken)
        private emailFactory: IEmailTemplateFactory
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.alert.daily.reminder.triggered;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as DailyReminderTriggeredEventPayload;
        const email = await this.emailLookup.findByRecipientId(payload.account.id);
        await this.mailer.send(email, this.emailFactory.createDailyReminderEmail());
    }
}
