import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IEmailTemplateFactory } from "@/modules/mail/templates/IEmailTemplate.factory";
import { AccountRemovalScheduledEmail } from "@/modules/mail/templates/sendgrid/AccountRemovalScheduledEmail";
import { DailyReminderEmail } from "@/modules/mail/templates/sendgrid/DailyReminderEmail";
import { PasswordResetRequestedEmail } from "@/modules/mail/templates/sendgrid/PasswordResetRequestedEmail";
import { PasswordUpdatedEmail } from "@/modules/mail/templates/sendgrid/PasswordUpdatedEmail";
import { TwoFactorAuthCodeIssuedEmail } from "@/modules/mail/templates/sendgrid/TwoFactorAuthCodeIssuedEmail";
import { UserActivatedEmail } from "@/modules/mail/templates/sendgrid/UserActivatedEmail";
import { UserActivationEmail } from "@/modules/mail/templates/sendgrid/UserActivationEmail";

@Injectable()
export class SendgridEmailTemplateFactory implements IEmailTemplateFactory {
    private readonly appName: string;
    private readonly appUrl: string;

    public constructor(private readonly configService: ConfigService) {
        this.appUrl = this.configService.getOrThrow<string>("client.url.base");
        this.appName = this.configService.getOrThrow<string>("appName");
    }

    createAccountRemovalScheduledEmail(toBeRemovedAt: string) {
        return new AccountRemovalScheduledEmail(this.appName, this.appUrl, toBeRemovedAt);
    }

    createDailyReminderEmail() {
        return new DailyReminderEmail(this.appName, this.appUrl);
    }

    createPasswordResetRequestedEmail(redirectUrl: string) {
        return new PasswordResetRequestedEmail(this.appName, this.appUrl, redirectUrl);
    }

    createPasswordUpdatedEmail() {
        return new PasswordUpdatedEmail(this.appName, this.appUrl);
    }

    createTwoFactorAuthCodeIssuedEmail(code: string) {
        return new TwoFactorAuthCodeIssuedEmail(this.appName, this.appUrl, code);
    }

    createUserActivatedEmail() {
        return new UserActivatedEmail(this.appName, this.appUrl);
    }

    createUserActivationEmail(redirectUrl: string) {
        return new UserActivationEmail(this.appName, this.appUrl, redirectUrl);
    }
}
