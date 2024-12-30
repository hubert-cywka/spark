import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { whenError } from "@/common/errors/whenError";
import { AccountActivationTokenRequestedEventPayload, IInboxEventHandler, IntegrationEvent, IntegrationEventTopics } from "@/common/events";
import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService, IMailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { UserActivationEmail } from "@/modules/mail/templates/UserActivationEmail";

@Injectable()
export class AccountActivationTokenRequestedEventHandler implements IInboxEventHandler {
    constructor(
        @Inject(IMailerServiceToken) private mailer: IMailerService,
        private readonly configService: ConfigService
    ) {}

    public canHandle(topic: string): boolean {
        return topic === IntegrationEventTopics.account.activation.requested;
    }

    public async handle(event: IntegrationEvent): Promise<void> {
        const payload = event.getPayload() as AccountActivationTokenRequestedEventPayload;
        try {
            const accountActivationPage = this.configService.getOrThrow<string>("client.url.accountActivationPage");
            const appUrl = this.configService.getOrThrow<string>("client.url.base");
            const pageUrl = appUrl.concat(accountActivationPage);
            await this.mailer.send(payload.email, new UserActivationEmail(payload.activationToken, pageUrl));
        } catch (e) {
            whenError(e).is(EmailDeliveryError).throwRpcException("Email couldn't be delivered.").elseRethrow();
        }
    }
}
