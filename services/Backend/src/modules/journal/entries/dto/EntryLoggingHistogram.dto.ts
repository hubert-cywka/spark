import { IsArray, IsNumber, IsObject } from "class-validator";

import { DailyRangeDto } from "@/modules/journal/shared/dto/DailyRange.dto";

export class EntryLoggingHistogramDto {
    @IsObject()
    dailyRange!: DailyRangeDto;

    @IsArray()
    days!: EntryLoggingHistogramDayDto[];
}

class EntryLoggingHistogramDayDto {
    @IsNumber()
    dayOfWeek!: number;

    @IsObject()
    hours!: EntryLoggingHistogramHourDto[];
}

class EntryLoggingHistogramHourDto {
    @IsNumber()
    hour!: number;

    @IsNumber()
    count!: number;
}
