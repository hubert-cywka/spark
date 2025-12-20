import { Module } from "@nestjs/common";

import { DailyController } from "@/modules/journal/daily/controllers/Daily.controller";
import { DailyMapper } from "@/modules/journal/daily/mappers/Daily.mapper";
import { DailyMapperToken } from "@/modules/journal/daily/mappers/IDaily.mapper";
import { DailyService } from "@/modules/journal/daily/services/implementations/Daily.service";
import { DailyInsightsProvider } from "@/modules/journal/daily/services/implementations/DailyInsightsProvider.service";
import { DailyProviderService } from "@/modules/journal/daily/services/implementations/DailyProvider.service";
import { DailyServiceToken } from "@/modules/journal/daily/services/interfaces/IDaily.service";
import { DailyInsightsProviderToken } from "@/modules/journal/daily/services/interfaces/IDailyInsightsProvider.service";
import { DailyProviderServiceToken } from "@/modules/journal/daily/services/interfaces/IDailyProvider.service";
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
            provide: DailyProviderServiceToken,
            useClass: DailyProviderService,
        },
        {
            provide: DailyInsightsProviderToken,
            useClass: DailyInsightsProvider,
        },
    ],
    controllers: [DailyController],
    exports: [DailyProviderServiceToken],
})
export class DailyModule {}
