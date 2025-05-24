import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class UserActivationEmail implements IEmailTemplate {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string,
        private readonly redirectUrl: string
    ) {}

    public getTemplateId(): string {
        return "d-78f36b08c6434118a2efc69712f310e9";
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
