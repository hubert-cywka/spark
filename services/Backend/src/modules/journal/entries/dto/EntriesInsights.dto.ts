import { IsNumber, IsObject } from "class-validator";

import { DailyRangeDto } from "@/modules/journal/shared/dto/DailyRange.dto";

export class EntriesInsightsDto {
    @IsObject()
    dailyRange!: DailyRangeDto;

    @IsNumber()
    totalEntriesAmount!: number;

    @IsNumber()
    pendingEntriesAmount!: number;

    @IsNumber()
    completedEntriesAmount!: number;

    @IsNumber()
    completedEntriesRatio!: number;

    @IsNumber()
    featuredEntriesAmount!: number;

    @IsNumber()
    featuredEntriesRatio!: number;
}
