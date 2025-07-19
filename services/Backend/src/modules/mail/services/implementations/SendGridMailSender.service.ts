import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import sendgridMailer from "@sendgrid/mail";

import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailSender } from "@/modules/mail/services/interfaces/IMailSender.service";
import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

@Injectable()
export class SendGridMailSender implements IMailSender {
    private readonly logger = new Logger(SendGridMailSender.name);
    private readonly senderName: string;
    private readonly isInDebugMode: boolean;

    public constructor(configService: ConfigService) {
        this.senderName = configService.getOrThrow<string>("modules.mail.sender.name");
        this.isInDebugMode = configService.getOrThrow<boolean>("modules.mail.isDebugMode");
        sendgridMailer.setApiKey(configService.getOrThrow<string>("modules.mail.sender.password"));
    }

    public async send(recipient: string, template: IEmailTemplate): Promise<void> {
        const templateId = template.getTemplateId();
        const templateVariables = template.getTemplateVariables();

        if (this.isInDebugMode) {
            this.logger.log({ recipient, templateId }, "Mailer is running in debug mode, the real email was not sent.");
            return;
        }

        try {
            await sendgridMailer.send({
                to: recipient,
                from: this.senderName,
                templateId,
                dynamicTemplateData: templateVariables,
            });

            this.logger.log({ recipient, templateId }, "Email sent.");
        } catch (e) {
            this.logger.error({ recipient, templateId, error: e }, "Failed to send email.");
            throw new EmailDeliveryError(JSON.stringify(e));
        }
    }
}
