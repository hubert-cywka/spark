import { Module } from "@nestjs/common";

import { DailyEntryController } from "@/modules/journal/entries/controllers/DailyEntry.controller";
import { EntryController } from "@/modules/journal/entries/controllers/Entry.controller";
import { EntryMapper } from "@/modules/journal/entries/mappers/Entry.mapper";
import { EntryDetailMapper } from "@/modules/journal/entries/mappers/EntryDetail.mapper";
import { EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { EntryDetailMapperToken } from "@/modules/journal/entries/mappers/IEntryDetail.mapper";
import { EntriesInsightsProvider } from "@/modules/journal/entries/services/implementations/EntriesInsightsProvider.service";
import { EntryService } from "@/modules/journal/entries/services/implementations/Entry.service";
import { EntriesInsightsProviderToken } from "@/modules/journal/entries/services/interfaces/IEntriesInsightsProvider.service";
import { EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntry.service";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    imports: [JournalSharedModule],
    providers: [
        { provide: EntryMapperToken, useClass: EntryMapper },
        { provide: EntryDetailMapperToken, useClass: EntryDetailMapper },
        { provide: EntryServiceToken, useClass: EntryService },
        {
            provide: EntriesInsightsProviderToken,
            useClass: EntriesInsightsProvider,
        },
    ],
    controllers: [EntryController, DailyEntryController],
})
export class EntriesModule {}
