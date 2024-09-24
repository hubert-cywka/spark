import { Module } from "@nestjs/common";

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
    exports: [IMailServiceToken],
})
export class MailModule {}
