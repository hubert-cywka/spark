import { Module } from "@nestjs/common";

import { DailyController } from "@/modules/journal/daily/controllers/Daily.controller";
import { DailyMapper } from "@/modules/journal/daily/mappers/Daily.mapper";
import { DailyMapperToken } from "@/modules/journal/daily/mappers/IDaily.mapper";
import { DailyService } from "@/modules/journal/daily/services/implementations/Daily.service";
import { DailyServiceToken } from "@/modules/journal/daily/services/interfaces/IDaily.service";

@Module({
    providers: [
        {
            provide: DailyMapperToken,
            useClass: DailyMapper,
        },
        {
            provide: DailyServiceToken,
            useClass: DailyService,
        },
    ],
    controllers: [DailyController],
})
export class DailyModule {}
