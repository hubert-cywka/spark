import { ISendGridEmailTemplate } from "@/modules/mail/templates/sendgrid/ISendGridEmailTemplate";

export class PasswordResetRequestedEmail implements ISendGridEmailTemplate {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string,
        private redirectUrl: string
    ) {}

    public getTemplateId(): string {
        return "d-69da2c63a6a84ae9bcaf4afbc09491fe";
    }

    public getTemplateVariables(): Record<string, unknown> {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            redirectUrl: this.redirectUrl,
            currentYear: new Date().getFullYear(),
        };
    }
}
