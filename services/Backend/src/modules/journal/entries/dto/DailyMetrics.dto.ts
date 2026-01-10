import { IsArray, IsNumber, IsObject } from "class-validator";

import { IsNullable } from "@/lib/validation";
import { DailyActivityDto } from "@/modules/journal/entries/dto/DailyActivity.dto";
import { DailyRangeDto } from "@/modules/journal/shared/dto/DailyRange.dto";

export class DailyMetricsDto {
    @IsObject()
    dateRange!: DailyRangeDto;

    @IsArray()
    activityHistory!: DailyActivityDto[];

    @IsNumber()
    totalActiveDays!: number;

    @IsNumber()
    activeDayRate!: number;

    @IsNumber()
    meanActivityPerDay!: number;

    @IsNumber()
    @IsNullable()
    currentActivityStreak!: number | null;

    @IsNumber()
    longestActivityStreak!: number;
}
