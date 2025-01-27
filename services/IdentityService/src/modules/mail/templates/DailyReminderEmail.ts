import { type IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class DailyReminderEmail implements IEmailTemplate {
    public constructor(private pageUrl: string) {}

    public getSubject(): string {
        return "Your daily reminder";
    }

    public getBody(): string {
        const link = new URL(this.pageUrl);

        return `<h1>Hi!</h1><p>We are reminding you about your daily tracking, as you requested. So, come visit us: </p><p><a href="${link.toString()}">${link.toString()}</a></p><p>You can always turn those alerts off in the application settings.</p>`;
    }
}
