import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { whenError } from "@/common/errors/whenError";
import { IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { type DailyReminderTriggeredEventPayload } from "@/common/events/types/alert/DailyReminderTriggeredEvent";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { DailyReminderEmail } from "@/modules/mail/templates/DailyReminderEmail";

@Injectable()
export class DailyReminderTriggeredEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService,
        private readonly configService: ConfigService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.alert.daily.reminder.triggered;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as DailyReminderTriggeredEventPayload;
        try {
            const appUrl = this.configService.getOrThrow<string>("client.url.base");
            await this.mailer.send(payload.email, new DailyReminderEmail(appUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
