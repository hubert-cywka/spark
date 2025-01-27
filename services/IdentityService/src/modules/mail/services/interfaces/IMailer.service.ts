import { type IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export const MailerServiceToken = Symbol("IMailerServiceToken");

export interface IMailerService {
    send(recipient: string, email: IEmailTemplate): Promise<void>;
}
