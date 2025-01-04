import { Module } from "@nestjs/common";

import { IInboxEventHandler, InboxEventHandlersToken } from "@/common/events";
import { AuthorModule } from "@/modules/journal/author/Author.module";
import { AccountRegisteredEventHandler } from "@/modules/journal/author/events/AccountRegisteredEvent.handler";
import { DailyModule } from "@/modules/journal/daily/Daily.module";
import { JournalSubscriber } from "@/modules/journal/Journal.subscriber";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    providers: [
        {
            provide: InboxEventHandlersToken,
            useFactory: (...handlers: IInboxEventHandler[]) => handlers,
            inject: [AccountRegisteredEventHandler],
        },
    ],
    imports: [JournalSharedModule, AuthorModule, DailyModule],
    controllers: [JournalSubscriber],
})
export class JournalModule {}
