import { type IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class AccountRemovalRequestedEmail implements IEmailTemplate {
    public constructor() {}

    public getSubject(): string {
        return "Your request to remove your data.";
    }

    public getBody(): string {
        return "<h1>Hi!</h1><p>We have processed your request to remove your data. You won't be able to log in to our app anymore. All your data will be removed after the retention period. If you want to revoke your request and cancel this process, please contact us.</p>";
    }
}
