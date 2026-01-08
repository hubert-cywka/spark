import { Module } from "@nestjs/common";

import { EntryController } from "@/modules/journal/entries/controllers/Entry.controller";
import { EntryMapper } from "@/modules/journal/entries/mappers/Entry.mapper";
import { EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { EntriesDataExportProvider } from "@/modules/journal/entries/services/implementations/EntriesDataExportProvider";
import { EntriesInsightsProvider } from "@/modules/journal/entries/services/implementations/EntriesInsightsProvider";
import { EntryService } from "@/modules/journal/entries/services/implementations/EntryService";
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
            provide: EntriesInsightsProviderToken,
            useClass: EntriesInsightsProvider,
        },
    ],
    controllers: [EntryController],
    exports: [EntriesDataExportProvider],
})
export class EntriesModule {}
