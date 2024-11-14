import { type IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class PasswordUpdatedEmail implements IEmailTemplate {
    public constructor(private appUrl: string) {}

    public getSubject(): string {
        return "Password updated";
    }

    public getBody(): string {
        const loginLink = `${this.appUrl}/authentication/login`;
        return `<h1>Hi!</h1><p>Your password has been updated. You can now log in with your new password.</p><p><a href="${loginLink}">${loginLink}</a></p>`;
    }
}
