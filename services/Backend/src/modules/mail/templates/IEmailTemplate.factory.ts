export const EmailTemplateFactoryToken = Symbol("EmailTemplateFactory");

export interface IEmailTemplateFactory<T> {
    createUserActivationEmail(url: string): T;
    createUserActivatedEmail(): T;

    createTwoFactorAuthCodeIssuedEmail(code: string): T;

    createPasswordUpdatedEmail(): T;
    createPasswordResetRequestedEmail(url: string): T;

    createDailyReminderEmail(): T;

    createAccountRemovalRequestedEmail(retentionPeriod: number): T;
}
