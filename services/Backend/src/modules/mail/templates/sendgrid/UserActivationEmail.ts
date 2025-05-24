import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

type TemplateVariables = {
    appName: string;
    appUrl: string;
    redirectUrl: string;
    currentYear: number;
};

export class UserActivationEmail implements IEmailTemplate<TemplateVariables> {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string,
        private readonly redirectUrl: string
    ) {}

    public getTemplateId() {
        return "d-78f36b08c6434118a2efc69712f310e9";
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
