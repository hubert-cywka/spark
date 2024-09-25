import { IEmailTemplate } from "@/mail/templates/IEmailTemplate";

export const IMailerServiceToken = Symbol("IMailerServiceToken");

export interface IMailerService {
    send(recipient: string, email: IEmailTemplate): Promise<void>;
}
