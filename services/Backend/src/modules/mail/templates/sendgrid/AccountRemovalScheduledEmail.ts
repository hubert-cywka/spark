import { ISendGridEmailTemplate } from "@/modules/mail/templates/sendgrid/ISendGridEmailTemplate";

export class AccountRemovalScheduledEmail implements ISendGridEmailTemplate {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string,
        private readonly toBeRemovedAt: string
    ) {}

    public getTemplateId(): string {
        return "d-327d877ff67c4f90a93773aa1a86acf9";
    }

    public getTemplateVariables(): Record<string, unknown> {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            toBeRemovedAt: this.toBeRemovedAt,
            currentYear: new Date().getFullYear(),
        };
    }
}
