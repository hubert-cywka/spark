import { Module } from "@nestjs/common";

import { MailerService } from "@/mail/services/implementations/Mailer.service";
import { IMailerServiceToken } from "@/mail/services/interfaces/IMailer.service";
import { UserSubscriber } from "@/mail/User.subscriber";

@Module({
    imports: [],
    providers: [
        {
            provide: IMailerServiceToken,
            useClass: MailerService,
        },
    ],
    controllers: [UserSubscriber],
    exports: [IMailerServiceToken],
})
export class MailModule {}
