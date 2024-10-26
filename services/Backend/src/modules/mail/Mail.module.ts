import { Module } from "@nestjs/common";

import { MailerService } from "@/modules/mail/services/implementations/Mailer.service";
import { IMailerServiceToken } from "@/modules/mail/services/interfaces/IMailer.service";
import { UserSubscriber } from "@/modules/mail/User.subscriber";

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
