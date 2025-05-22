import { Inject, Injectable } from "@nestjs/common";

import { whenError } from "@/common/errors/whenError";
import { IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type DailyReminderTriggeredEventPayload } from "@/common/events/types/alert/DailyReminderTriggeredEvent";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class DailyReminderTriggeredEventHandler<T> implements IInboxEventHandler {
    constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService<T>,
        @Inject(EmailTemplateFactoryToken)
        private emailFactory: IEmailTemplateFactory<T>
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.alert.daily.reminder.triggered;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as DailyReminderTriggeredEventPayload;
        try {
            await this.mailer.send(payload.email, this.emailFactory.createDailyReminderEmail());
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
