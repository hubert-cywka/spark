import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export const MailCompilerServiceToken = Symbol("MailCompilerService");

export interface IMailCompilerService {
    compile(email: IEmailTemplate): { html: string; subject: string };
}
