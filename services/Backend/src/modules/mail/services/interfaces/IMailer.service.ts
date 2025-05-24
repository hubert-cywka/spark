import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export const MailerServiceToken = Symbol("IMailerServiceToken");

export interface IMailerService {
    send(recipient: string, template: IEmailTemplate): Promise<void>;
}
