import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export const MailSenderToken = Symbol("MailSender");

export interface IMailSender {
    send(recipient: string, template: IEmailTemplate): Promise<void>;
}
