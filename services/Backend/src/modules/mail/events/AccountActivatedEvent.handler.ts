import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { whenError } from "@/common/errors/whenError";
import { AccountActivatedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, MailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { UserActivatedEmail } from "@/modules/mail/templates/UserActivatedEmail";

@Injectable()
export class AccountActivatedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(MailerServiceToken) private mailer: IMailerService,
        private readonly configService: ConfigService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.activation.completed;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = (await event.getPayload()) as AccountActivatedEventPayload;
        try {
            const appUrl = this.configService.getOrThrow<string>("client.url.base");
            await this.mailer.send(payload.email, new UserActivatedEmail(appUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
