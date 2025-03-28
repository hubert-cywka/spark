import { type IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class AccountRemovalRequestedEmail implements IEmailTemplate {
    public constructor(private appUrl: string) {}

    public getSubject(): string {
        return "Your request to remove your data.";
    }

    public getBody(): string {
        const loginLink = `${this.appUrl}/authentication/login`;
        return `<h1>Hi!</h1><p>You have requested to delete your account, and we've accepted it. All your data will be removed after the retention period. If you want to cancel this process, please log in: </p><p><a href="${loginLink}">${loginLink}</a></p>`;
    }
}
