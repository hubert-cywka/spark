import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import sendgridMailer from "@sendgrid/mail";

import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { type IMailerService } from "@/modules/mail/services/interfaces/IMailer.service";
import { ISendGridEmailTemplate } from "@/modules/mail/templates/sendgrid/ISendGridEmailTemplate";

@Injectable()
export class SendGridMailerService implements IMailerService<ISendGridEmailTemplate> {
    private readonly logger = new Logger(SendGridMailerService.name);
    private readonly senderName: string;
    private readonly isInDebugMode: boolean;

    public constructor(configService: ConfigService) {
        this.senderName = configService.getOrThrow<string>("modules.mail.sender.name");
        this.isInDebugMode = configService.getOrThrow<boolean>("modules.mail.isDebugMode");
        sendgridMailer.setApiKey(configService.getOrThrow<string>("modules.mail.sender.password"));
    }

    public async send(recipient: string, template: ISendGridEmailTemplate): Promise<void> {
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
