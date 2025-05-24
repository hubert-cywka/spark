import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class PasswordUpdatedEmail implements IEmailTemplate {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string
    ) {}

    public getTemplateId(): string {
        return "d-34d04734596044518dd3cdf2a59ec080";
    }

    public getTemplateVariables(): Record<string, unknown> {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            currentYear: new Date().getFullYear(),
        };
    }
}
