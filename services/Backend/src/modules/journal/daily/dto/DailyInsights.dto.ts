import { IsArray, IsNumber, IsObject } from "class-validator";

import { DailyActivityDto } from "@/modules/journal/daily/dto/DailyActivity.dto";
import { DailyRangeDto } from "@/modules/journal/shared/dto/DailyRange.dto";

export class DailyInsightsDto {
    @IsObject()
    dateRange!: DailyRangeDto;

    @IsArray()
    activityHistory!: DailyActivityDto[];

    @IsNumber()
    totalActiveDays!: number;

    @IsNumber()
    meanActivityPerDay!: number;

    @IsNumber()
    currentActivityStreak!: number;

    @IsNumber()
    longestActivityStreak!: number;
}
