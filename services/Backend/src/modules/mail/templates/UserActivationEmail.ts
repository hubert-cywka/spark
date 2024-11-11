import { type IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class UserActivationEmail implements IEmailTemplate {
    public constructor(
        private activationToken: string,
        private pageUrl: string
    ) {}

    public getSubject(): string {
        return "Verify your email";
    }

    public getBody(): string {
        const activationLink = new URL(this.pageUrl);
        activationLink.searchParams.set("token", this.activationToken);

        return `<h1>Hi!</h1><p>Please confirm your email address by clicking the link below or copying it and opening in a new tab.</p><p><a href="${activationLink.toString()}">${activationLink.toString()}</a></p><p>The link will expire in 15 minutes. If you did not sign up, you can simply disregard this email.</p>`;
    }
}
