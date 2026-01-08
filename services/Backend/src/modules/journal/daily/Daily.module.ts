import { Module } from "@nestjs/common";

import { DailyController } from "@/modules/journal/daily/controllers/Daily.controller";
import { DailyInsightsProvider } from "@/modules/journal/daily/services/implementations/DailyInsightsProvider";
import { DailyInsightsProviderToken } from "@/modules/journal/daily/services/interfaces/IDailyInsightsProvider";
import { JournalSharedModule } from "@/modules/journal/shared/JournalShared.module";

@Module({
    imports: [JournalSharedModule],
    providers: [
        {
            provide: DailyInsightsProviderToken,
            useClass: DailyInsightsProvider,
        },
    ],
    controllers: [DailyController],
    exports: [],
})
export class DailyModule {}
