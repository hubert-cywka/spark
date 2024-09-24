import { Module } from "@nestjs/common";

import { AuthSubscriber } from "@/mail/Auth.subscriber";
import { IMailServiceToken } from "@/mail/services/IMail.service";
import { MailService } from "@/mail/services/Mail.service";

@Module({
    imports: [],
    providers: [
        {
            provide: IMailServiceToken,
            useClass: MailService,
        },
    ],
    controllers: [AuthSubscriber],
    exports: [IMailServiceToken],
})
export class MailModule {}
