import { Inject, Injectable } from "@nestjs/common";

import { IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type DailyReminderTriggeredEventPayload } from "@/common/events/types/alert/DailyReminderTriggeredEvent";
import { type IEmailLookupService, EmailLookupServiceToken } from "@/modules/mail/services/interfaces/IEmailLookup.service";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class DailyReminderTriggeredEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService,
        @Inject(EmailLookupServiceToken)
        private emailLookup: IEmailLookupService,
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
