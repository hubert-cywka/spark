import { IsArray, IsBoolean, IsDateString, IsString } from "class-validator";

import { UTCDay } from "@/modules/alerts/types/UTCDay";

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
    readonly daysOfWeek!: UTCDay[];

    @IsDateString()
    readonly nextTriggerAt!: string | null;

    @IsDateString()
    readonly createdAt!: string;
}
