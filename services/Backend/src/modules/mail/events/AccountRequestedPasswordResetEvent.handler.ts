import { Inject, Injectable } from "@nestjs/common";

import { AccountRequestedPasswordResetEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEvents } from "@/common/events";
import { type IEmailLookup, EmailLookupToken } from "@/modules/mail/services/interfaces/IEmailLookup.service";
import { type IMailSender, MailSenderToken } from "@/modules/mail/services/interfaces/IMailSender.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class AccountRequestedPasswordResetEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(MailSenderToken) private mailer: IMailSender,
        @Inject(EmailLookupToken)
        private emailLookup: IEmailLookup,
        @Inject(EmailTemplateFactoryToken)
        private emailFactory: IEmailTemplateFactory
    ) {}

    public canHandle(subject: string): boolean {
        return subject === IntegrationEvents.account.password.resetRequested.subject;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountRequestedPasswordResetEventPayload;
        const email = await this.emailLookup.findByRecipientId(payload.account.id);
        await this.mailer.send(email, this.emailFactory.createPasswordResetRequestedEmail(payload.redirectUrl));
    }
}
