import { Module } from "@nestjs/common";

import { DailyController } from "@/modules/journal/daily/controllers/Daily.controller";
import { DailyMapper } from "@/modules/journal/daily/mappers/Daily.mapper";
import { DailyMapperToken } from "@/modules/journal/daily/mappers/IDaily.mapper";
import { DailyInsightsProvider } from "@/modules/journal/daily/services/implementations/DailyInsightsProvider";
import { DailyProvider } from "@/modules/journal/daily/services/implementations/DailyProvider";
import { DailyService } from "@/modules/journal/daily/services/implementations/DailyService";
import { DailyInsightsProviderToken } from "@/modules/journal/daily/services/interfaces/IDailyInsightsProvider";
import { DailyProviderToken } from "@/modules/journal/daily/services/interfaces/IDailyProvider";
import { DailyServiceToken } from "@/modules/journal/daily/services/interfaces/IDailyService";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    imports: [JournalSharedModule],
    providers: [
        {
            provide: DailyMapperToken,
            useClass: DailyMapper,
        },
        {
            provide: DailyServiceToken,
            useClass: DailyService,
        },
        {
            provide: DailyProviderToken,
            useClass: DailyProvider,
        },
        {
            provide: DailyInsightsProviderToken,
            useClass: DailyInsightsProvider,
        },
    ],
    controllers: [DailyController],
    exports: [DailyProviderToken],
})
export class DailyModule {}
