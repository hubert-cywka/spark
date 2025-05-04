import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { whenError } from "@/common/errors/whenError";
import { AccountPasswordUpdatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { PasswordUpdatedEmail } from "@/modules/mail/templates/PasswordUpdatedEmail";

@Injectable()
export class AccountPasswordUpdatedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService,
        private readonly configService: ConfigService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.password.updated;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountPasswordUpdatedEventPayload;
        try {
            const appUrl = this.configService.getOrThrow<string>("client.url.base");
            await this.mailer.send(payload.email, new PasswordUpdatedEmail(appUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
