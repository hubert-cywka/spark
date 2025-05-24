import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

type TemplateVariables = {
    appName: string;
    appUrl: string;
    redirectUrl: string;
    currentYear: number;
};

export class PasswordResetRequestedEmail implements IEmailTemplate<TemplateVariables> {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string,
        private redirectUrl: string
    ) {}

    public getTemplateId() {
        return "d-69da2c63a6a84ae9bcaf4afbc09491fe";
    }

    public getTemplateVariables() {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            redirectUrl: this.redirectUrl,
            currentYear: new Date().getFullYear(),
        };
    }
}
