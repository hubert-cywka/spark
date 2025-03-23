import { Module } from "@nestjs/common";

import { DailyEntryController } from "@/modules/journal/entries/controllers/DailyEntry.controller";
import { EntryController } from "@/modules/journal/entries/controllers/Entry.controller";
import { EntryMapper } from "@/modules/journal/entries/mappers/Entry.mapper";
import { EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { EntriesInsightsService } from "@/modules/journal/entries/services/implementations/EntriesInsights.service";
import { EntryService } from "@/modules/journal/entries/services/implementations/Entry.service";
import { EntriesInsightsServiceToken } from "@/modules/journal/entries/services/interfaces/IEntriesInsights.service";
import { EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntry.service";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    imports: [JournalSharedModule],
    providers: [
        { provide: EntryMapperToken, useClass: EntryMapper },
        { provide: EntryServiceToken, useClass: EntryService },
        {
            provide: EntriesInsightsServiceToken,
            useClass: EntriesInsightsService,
        },
    ],
    controllers: [EntryController, DailyEntryController],
})
export class EntriesModule {}
