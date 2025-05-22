import { ISendGridEmailTemplate } from "@/modules/mail/templates/sendgrid/ISendGridEmailTemplate";

export class UserActivatedEmail implements ISendGridEmailTemplate {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string
    ) {}

    public getTemplateId(): string {
        return "d-f3c67f24eb6547c9a0c1ec85c02d5200";
    }

    public getTemplateVariables(): Record<string, unknown> {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            currentYear: new Date().getFullYear(),
        };
    }
}
