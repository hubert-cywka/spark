import { IsArray, IsBoolean, IsDateString, IsString } from "class-validator";

import { Weekday } from "@/modules/alerts/enums/Weekday.enum";

export class AlertDto {
    @IsString()
    readonly id!: string;

    @IsBoolean()
    readonly enabled!: boolean;

    @IsString()
    readonly recipientId!: string;

    @IsString()
    readonly time!: string;

    @IsArray()
    readonly daysOfWeek!: Weekday[];

    @IsDateString()
    readonly lastTriggeredAt!: string | null;

    @IsDateString()
    readonly createdAt!: string;
}
