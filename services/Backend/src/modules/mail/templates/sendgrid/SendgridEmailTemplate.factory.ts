import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IEmailTemplateFactory } from "@/modules/mail/templates/IEmailTemplate.factory";
import { AccountRemovalScheduledEmail } from "@/modules/mail/templates/sendgrid/AccountRemovalScheduledEmail";
import { DailyReminderEmail } from "@/modules/mail/templates/sendgrid/DailyReminderEmail";
import { ISendGridEmailTemplate } from "@/modules/mail/templates/sendgrid/ISendGridEmailTemplate";
import { PasswordResetRequestedEmail } from "@/modules/mail/templates/sendgrid/PasswordResetRequestedEmail";
import { PasswordUpdatedEmail } from "@/modules/mail/templates/sendgrid/PasswordUpdatedEmail";
import { TwoFactorAuthCodeIssuedEmail } from "@/modules/mail/templates/sendgrid/TwoFactorAuthCodeIssuedEmail";
import { UserActivatedEmail } from "@/modules/mail/templates/sendgrid/UserActivatedEmail";
import { UserActivationEmail } from "@/modules/mail/templates/sendgrid/UserActivationEmail";

@Injectable()
export class SendgridEmailTemplateFactory implements IEmailTemplateFactory<ISendGridEmailTemplate> {
    private readonly appName: string;
    private readonly appUrl: string;

    public constructor(private readonly configService: ConfigService) {
        this.appUrl = this.configService.getOrThrow<string>("client.url.base");
        this.appName = this.configService.getOrThrow<string>("appName");
    }

    createAccountRemovalScheduledEmail(toBeRemovedAt: Date): ISendGridEmailTemplate {
        return new AccountRemovalScheduledEmail(this.appName, this.appUrl, toBeRemovedAt);
    }

    createDailyReminderEmail(): ISendGridEmailTemplate {
        return new DailyReminderEmail(this.appName, this.appUrl);
    }

    createPasswordResetRequestedEmail(redirectUrl: string): ISendGridEmailTemplate {
        return new PasswordResetRequestedEmail(this.appName, this.appUrl, redirectUrl);
    }

    createPasswordUpdatedEmail(): ISendGridEmailTemplate {
        return new PasswordUpdatedEmail(this.appName, this.appUrl);
    }

    createTwoFactorAuthCodeIssuedEmail(code: string): ISendGridEmailTemplate {
        return new TwoFactorAuthCodeIssuedEmail(this.appName, this.appUrl, code);
    }

    createUserActivatedEmail(): ISendGridEmailTemplate {
        return new UserActivatedEmail(this.appName, this.appUrl);
    }

    createUserActivationEmail(redirectUrl: string): ISendGridEmailTemplate {
        return new UserActivationEmail(this.appName, this.appUrl, redirectUrl);
    }
}
