import { type IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class TwoFactorAuthCodeIssuedEmail implements IEmailTemplate {
    public constructor(private readonly code: string) {}

    public getSubject(): string {
        return "Your 2FA code";
    }

    public getBody(): string {
        return `<p>Your 2FA code: ${this.code}.</p>`;
    }
}
