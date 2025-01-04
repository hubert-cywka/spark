import { Module } from "@nestjs/common";

import { AccountRegisteredEventHandler } from "@/modules/journal/author/events/AccountRegisteredEvent.handler";
import { AuthorMapper } from "@/modules/journal/author/mappers/Author.mapper";
import { AuthorMapperToken } from "@/modules/journal/author/mappers/IAuthor.mapper";
import { AuthorService } from "@/modules/journal/author/services/implementations/Author.service";
import { AuthorServiceToken } from "@/modules/journal/author/services/interfaces/IAuthor.service";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    imports: [JournalSharedModule],
    providers: [
        {
            provide: AuthorMapperToken,
            useClass: AuthorMapper,
        },
        {
            provide: AuthorServiceToken,
            useClass: AuthorService,
        },
        AccountRegisteredEventHandler,
    ],
    exports: [AuthorServiceToken, AccountRegisteredEventHandler],
})
export class AuthorModule {}
