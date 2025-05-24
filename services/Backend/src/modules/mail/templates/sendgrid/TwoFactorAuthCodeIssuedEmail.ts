import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class TwoFactorAuthCodeIssuedEmail implements IEmailTemplate {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string,
        private readonly code: string
    ) {}

    public getTemplateId(): string {
        return "d-544f430401ae4d95b4961aaac479b29f";
    }

    public getTemplateVariables(): Record<string, unknown> {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            code: this.code,
            currentYear: new Date().getFullYear(),
        };
    }
}
