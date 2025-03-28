import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { whenError } from "@/common/errors/whenError";
import { type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { AccountRemovalRequestedEventPayload } from "@/common/events/types/account/AccountRemovalRequestedEvent";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { AccountRemovalRequestedEmail } from "@/modules/mail/templates/AccountRemovalRequestedEmail";

@Injectable()
export class AccountRemovalRequestedEventHandler implements IInboxEventHandler {
    public constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService,
        private readonly configService: ConfigService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.requested;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalRequestedEventPayload;
        try {
            const appUrl = this.configService.getOrThrow<string>("client.url.base");
            await this.mailer.send(payload.account.email, new AccountRemovalRequestedEmail(appUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
