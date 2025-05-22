import { ISendGridEmailTemplate } from "@/modules/mail/templates/sendgrid/ISendGridEmailTemplate";

export class DailyReminderEmail implements ISendGridEmailTemplate {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string
    ) {}

    public getTemplateId(): string {
        return "d-1fc3a37cacb84bae823e32250c8f5e78";
    }

    public getTemplateVariables(): Record<string, unknown> {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            currentYear: new Date().getFullYear(),
        };
    }
}
