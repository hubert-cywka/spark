import { type IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class UserActivatedEmail implements IEmailTemplate {
    public constructor(private appUrl: string) {}

    public getSubject(): string {
        return "Account activated";
    }

    public getBody(): string {
        const loginLink = `${this.appUrl}/authentication/login`;
        return `<h1>Hi!</h1><p>Your account has been activated. You can now log in.</p><p><a href="${loginLink}">${loginLink}</a></p>`;
    }
}
