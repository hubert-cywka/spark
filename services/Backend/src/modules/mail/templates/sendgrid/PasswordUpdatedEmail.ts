import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

type TemplateVariables = {
    appName: string;
    appUrl: string;
    currentYear: number;
};

export class PasswordUpdatedEmail implements IEmailTemplate<TemplateVariables> {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string
    ) {}

    public getTemplateId() {
        return "d-34d04734596044518dd3cdf2a59ec080";
    }

    public getTemplateVariables() {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            currentYear: new Date().getFullYear(),
        };
    }
}
