import { Module } from "@nestjs/common";

import { AccountRegisteredEventHandler } from "@/modules/journal/authors/events/AccountRegisteredEvent.handler";
import { AuthorRemovedEventHandler } from "@/modules/journal/authors/events/AuthorRemovedEvent.handler";
import { AuthorMapper } from "@/modules/journal/authors/mappers/Author.mapper";
import { AuthorMapperToken } from "@/modules/journal/authors/mappers/IAuthor.mapper";
import { AuthorService } from "@/modules/journal/authors/services/implementations/Author.service";
import { AuthorServiceToken } from "@/modules/journal/authors/services/interfaces/IAuthor.service";
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
        AuthorRemovedEventHandler,
    ],
    exports: [AuthorServiceToken, AccountRegisteredEventHandler, AuthorRemovedEventHandler],
})
export class AuthorsModule {}
