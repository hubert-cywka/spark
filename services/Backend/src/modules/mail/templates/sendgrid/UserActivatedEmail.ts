import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

type TemplateVariables = {
    appName: string;
    appUrl: string;
    currentYear: number;
};

export class UserActivatedEmail implements IEmailTemplate<TemplateVariables> {
    public constructor(
        private readonly appName: string,
        private readonly appUrl: string
    ) {}

    public getTemplateId() {
        return "d-f3c67f24eb6547c9a0c1ec85c02d5200";
    }

    public getTemplateVariables() {
        return {
            appName: this.appName,
            appUrl: this.appUrl,
            currentYear: new Date().getFullYear(),
        };
    }
}
