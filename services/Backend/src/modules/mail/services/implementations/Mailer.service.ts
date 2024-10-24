import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, Transporter } from "nodemailer";

import { EmailDeliveryError } from "@/modules/mail/errors/EmailDelivery.error";
import { IMailerService } from "@/modules/mail/services/interfaces/IMailer.service";
import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

@Injectable()
export class MailerService implements IMailerService {
    private readonly logger = new Logger();
    private readonly transporter: Transporter;
    private readonly senderName: string;
    private readonly isInDebugMode: boolean;

    public constructor(private configService: ConfigService) {
        this.senderName = this.configService.getOrThrow<string>("modules.mail.sender.name");
        this.isInDebugMode = this.configService.getOrThrow<boolean>("modules.mail.isDebugMode");

        this.transporter = createTransport({
            host: this.configService.getOrThrow<string>("modules.mail.sender.host"),
            port: this.configService.getOrThrow<number>("modules.mail.sender.port"),
            auth: {
                user: this.configService.getOrThrow<string>("modules.mail.sender.user"),
                pass: this.configService.getOrThrow<string>("modules.mail.sender.password"),
            },
        });
    }

    public async send(recipient: string, email: IEmailTemplate): Promise<void> {
        const subject = email.getSubject();
        const html = email.getBody();

        if (this.isInDebugMode) {
            this.logger.log({ recipient, subject }, "Mailer is running in debug mode, the real email was not sent.");
            return;
        }

        try {
            await this.transporter.sendMail({
                from: this.senderName,
                to: recipient,
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
