import { ISendGridEmailTemplate } from "@/modules/mail/templates/sendgrid/ISendGridEmailTemplate";

export class AccountRemovalRequestedEmail implements ISendGridEmailTemplate {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string,
        private readonly retentionPeriod: number
    ) {}

    public getTemplateId(): string {
        return "d-327d877ff67c4f90a93773aa1a86acf9";
    }

    public getTemplateVariables(): Record<string, unknown> {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            retentionPeriod: this.retentionPeriod,
            currentYear: new Date().getFullYear(),
        };
    }
}
