import { IsArray, IsEnum } from "class-validator";

import { IsArrayUnique } from "@/lib/validation/decorators/IsArrayUnique.decorator";
import { IsISOTime } from "@/lib/validation/decorators/IsISOTime.decorator";
import { Weekday } from "@/modules/alerts/enums/Weekday.enum";

export class CreateAlertDto {
    @IsArray()
    @IsArrayUnique()
    @IsEnum(Weekday, { each: true })
    daysOfWeek!: Weekday[];

    @IsISOTime()
    time!: string;
}
