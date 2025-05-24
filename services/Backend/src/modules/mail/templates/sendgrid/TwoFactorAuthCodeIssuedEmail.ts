import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

type TemplateVariables = {
    appName: string;
    appUrl: string;
    code: string;
    currentYear: number;
};

export class TwoFactorAuthCodeIssuedEmail implements IEmailTemplate<TemplateVariables> {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string,
        private readonly code: string
    ) {}

    public getTemplateId() {
        return "d-544f430401ae4d95b4961aaac479b29f";
    }

    public getTemplateVariables() {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            code: this.code,
            currentYear: new Date().getFullYear(),
        };
    }
}
