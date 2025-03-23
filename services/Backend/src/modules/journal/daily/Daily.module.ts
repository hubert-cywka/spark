import { Module } from "@nestjs/common";

import { DailyController } from "@/modules/journal/daily/controllers/Daily.controller";
import { DailyMapper } from "@/modules/journal/daily/mappers/Daily.mapper";
import { DailyMapperToken } from "@/modules/journal/daily/mappers/IDaily.mapper";
import { DailyService } from "@/modules/journal/daily/services/implementations/Daily.service";
import { DailyInsightsService } from "@/modules/journal/daily/services/implementations/DailyInsights.service";
import { DailyServiceToken } from "@/modules/journal/daily/services/interfaces/IDaily.service";
import { DailyActivityServiceToken } from "@/modules/journal/daily/services/interfaces/IDailyInsights.service";
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
            provide: DailyActivityServiceToken,
            useClass: DailyInsightsService,
        },
    ],
    controllers: [DailyController],
})
export class DailyModule {}
