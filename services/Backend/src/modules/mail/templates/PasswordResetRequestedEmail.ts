import { IEmailTemplate } from "@/modules/mail/templates/IEmailTemplate";

export class PasswordResetRequestedEmail implements IEmailTemplate {
    public constructor(
        private resetPasswordToken: string,
        private appUrl: string
    ) {}

    public getSubject(): string {
        return "You have requested to reset your password";
    }

    public getBody(): string {
        const resetPasswordLink = `${this.appUrl}/authentication/reset-password?token=${this.resetPasswordToken}`;
        return `<h1>Hi!</h1><p>Please click the link below to set new password:</p><p><a href="${resetPasswordLink}">${resetPasswordLink}</a></p><p>The link will expire in 15 minutes. If you did not request to change the password, you can simply ignore this mail.</p>`;
    }
}
