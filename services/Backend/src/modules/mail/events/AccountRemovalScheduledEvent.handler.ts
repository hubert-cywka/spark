import { Inject, Injectable, Logger } from "@nestjs/common";

import { type IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { AccountRemovalScheduledEventPayload } from "@/common/events/types/account/AccountRemovalScheduledEvent";
import { type IEmailLookupService, EmailLookupServiceToken } from "@/modules/mail/services/interfaces/IEmailLookup.service";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class AccountRemovalScheduledEventHandler<T> implements IInboxEventHandler {
    private readonly logger = new Logger(AccountRemovalScheduledEventHandler.name);

    public constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService<T>,
        @Inject(EmailLookupServiceToken)
        private emailLookup: IEmailLookupService,
        @Inject(EmailTemplateFactoryToken)
        private emailFactory: IEmailTemplateFactory<T>
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.removal.scheduled;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRemovalScheduledEventPayload;
        const email = await this.emailLookup.findByRecipientId(payload.account.id);
        await this.mailer.send(email, this.emailFactory.createAccountRemovalScheduledEmail(payload.toBeRemovedAt));
    }
}
