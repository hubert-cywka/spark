import Handlebars from "handlebars";

import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export abstract class HtmlEmail implements IEmailTemplate {
    public getSubject(): string {
        return "Your daily reminder.";
    }

    public getHtml(): string {
        const variables = this.getTemplateVariables();
        const rawHtml = this.getRawHtml();

        const compiledTemplate = Handlebars.compile(rawHtml);
        return compiledTemplate(variables);
    }

    protected abstract getRawHtml(): string;

    protected abstract getTemplateVariables(): object;
}
