import { Inject, Injectable } from "@nestjs/common";

import { whenError } from "@/common/errors/whenError";
import { EmailIntegrationTOTPIssuedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { type IEmailTemplateFactory, EmailTemplateFactoryToken } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class TwoFactorAuthCodeIssuedEventHandler<T> implements IInboxEventHandler {
    constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService<T>,
        @Inject(EmailTemplateFactoryToken)
        private emailFactory: IEmailTemplateFactory<T>
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.twoFactorAuth.email.issued;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as EmailIntegrationTOTPIssuedEventPayload;
        try {
            await this.mailer.send(payload.email, this.emailFactory.createTwoFactorAuthCodeIssuedEmail(payload.code));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
