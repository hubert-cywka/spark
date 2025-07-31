import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AccountRemovalScheduledEmail } from "@/modules/mail/templates/html/AccountRemovalScheduledEmail";
import { DailyReminderEmail } from "@/modules/mail/templates/html/DailyReminderEmail";
import { PasswordResetRequestedEmail } from "@/modules/mail/templates/html/PasswordResetRequestedEmail";
import { PasswordUpdatedEmail } from "@/modules/mail/templates/html/PasswordUpdatedEmail";
import { TwoFactorAuthCodeIssuedEmail } from "@/modules/mail/templates/html/TwoFactorAuthCodeIssuedEmail";
import { UserActivatedEmail } from "@/modules/mail/templates/html/UserActivatedEmail";
import { UserActivationEmail } from "@/modules/mail/templates/html/UserActivationEmail";
import { IEmailTemplateFactory } from "@/modules/mail/templates/IEmailTemplate.factory";

@Injectable()
export class HtmlEmailTemplateFactory implements IEmailTemplateFactory {
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
