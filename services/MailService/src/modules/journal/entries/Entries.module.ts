import { Module } from "@nestjs/common";

import { DailyEntryController } from "@/modules/journal/entries/controllers/DailyEntry.controller";
import { EntryController } from "@/modules/journal/entries/controllers/Entry.controller";
import { EntryMapper } from "@/modules/journal/entries/mappers/Entry.mapper";
import { EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { EntryService } from "@/modules/journal/entries/services/implementations/Entry.service";
import { EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntry.service";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    imports: [JournalSharedModule],
    providers: [
        { provide: EntryMapperToken, useClass: EntryMapper },
        { provide: EntryServiceToken, useClass: EntryService },
    ],
    controllers: [EntryController, DailyEntryController],
})
export class EntriesModule {}
