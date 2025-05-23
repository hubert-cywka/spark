import { Inject, Injectable } from "@nestjs/common";

import { whenError } from "@/common/errors/whenError";
import { AccountActivationTokenRequestedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IEmailLookupService, EmailLookupServiceToken } from "@/modules/mail/services/interfaces/IEmailLookup.service";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class AccountActivationTokenRequestedEventHandler<T> implements IInboxEventHandler {
    constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService<T>,
        @Inject(EmailLookupServiceToken)
        private emailLookup: IEmailLookupService,
        @Inject(EmailTemplateFactoryToken)
        private emailFactory: IEmailTemplateFactory<T>
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.activation.requested;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountActivationTokenRequestedEventPayload;
        try {
            const email = await this.emailLookup.findByRecipientId(payload.account.id);
            await this.mailer.send(email, this.emailFactory.createUserActivationEmail(payload.redirectUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
