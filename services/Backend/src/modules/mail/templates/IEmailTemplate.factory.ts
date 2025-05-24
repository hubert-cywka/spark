import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export const EmailTemplateFactoryToken = Symbol("EmailTemplateFactory");

export interface IEmailTemplateFactory {
    createUserActivationEmail(url: string): IEmailTemplate;
    createUserActivatedEmail(): IEmailTemplate;

    createTwoFactorAuthCodeIssuedEmail(code: string): IEmailTemplate;

    createPasswordUpdatedEmail(): IEmailTemplate;
    createPasswordResetRequestedEmail(url: string): IEmailTemplate;

    createDailyReminderEmail(): IEmailTemplate;

    createAccountRemovalScheduledEmail(toBeRemovedAt: string): IEmailTemplate;
}
