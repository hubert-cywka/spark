import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";

import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailSender } from "@/modules/mail/services/interfaces/IMailSender";
import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

@Injectable()
export class ResendMailSender implements IMailSender {
    private readonly logger = new Logger(ResendMailSender.name);
    private readonly resendClient: Resend | null = null;
    private readonly senderName: string;
    private readonly isInDebugMode: boolean;

    public constructor(configService: ConfigService) {
        this.senderName = configService.getOrThrow<string>("modules.mail.sender.name");
        this.isInDebugMode = configService.getOrThrow<boolean>("modules.mail.isDebugMode");

        if (!this.isInDebugMode) {
            this.resendClient = new Resend(configService.getOrThrow<string>("modules.mail.sender.password"));
        }
    }

    public async send(recipient: string, template: IEmailTemplate): Promise<void> {
        const subject = template.getSubject();
        const html = template.getHtml();

        if (this.isInDebugMode || !this.resendClient) {
            const variables = template.getVariables();
            this.logger.log({ recipient, subject, variables }, "Mailer is running in debug mode, the real email was" + " not sent.");
            return;
        }

        try {
            await this.resendClient.emails.send({
                to: recipient,
                from: this.senderName,
                subject,
                html,
            });

            this.logger.log({ recipient, subject }, "Email sent.");
        } catch (e) {
            this.logger.error({ recipient, subject, error: e }, "Failed to send email.");
            throw new EmailDeliveryError(JSON.stringify(e));
        }
    }
}
