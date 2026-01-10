import { Module } from "@nestjs/common";

import { DailyInsightsController } from "@/modules/journal/entries/controllers/DailyInsights.controller";
import { EntryController } from "@/modules/journal/entries/controllers/Entry.controller";
import { EntryMapper } from "@/modules/journal/entries/mappers/Entry.mapper";
import { EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { DailyInsightsProvider } from "@/modules/journal/entries/services/implementations/DailyInsightsProvider";
import { EntriesDataExportProvider } from "@/modules/journal/entries/services/implementations/EntriesDataExportProvider";
import { EntriesInsightsProvider } from "@/modules/journal/entries/services/implementations/EntriesInsightsProvider";
import { EntryService } from "@/modules/journal/entries/services/implementations/EntryService";
import { DailyInsightsProviderToken } from "@/modules/journal/entries/services/interfaces/IDailyInsightsProvider";
import { EntriesInsightsProviderToken } from "@/modules/journal/entries/services/interfaces/IEntriesInsightsProvider";
import { EntryServiceToken } from "@/modules/journal/entries/services/interfaces/IEntryService";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    imports: [JournalSharedModule],
    providers: [
        { provide: EntriesDataExportProvider, useClass: EntriesDataExportProvider },
        { provide: EntryMapperToken, useClass: EntryMapper },
        { provide: EntryServiceToken, useClass: EntryService },
        {
            provide: DailyInsightsProviderToken,
            useClass: DailyInsightsProvider,
        },
        {
            provide: EntriesInsightsProviderToken,
            useClass: EntriesInsightsProvider,
        },
    ],
    controllers: [EntryController, DailyInsightsController],
    exports: [EntriesDataExportProvider],
})
export class EntriesModule {}
