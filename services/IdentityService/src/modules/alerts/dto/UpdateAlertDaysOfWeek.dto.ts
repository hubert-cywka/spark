import { IsArray, IsEnum } from "class-validator";

import { IsArrayUnique } from "@/lib/validation/decorators/IsArrayUnique.decorator";
import { Weekday } from "@/modules/alerts/enums/Weekday.enum";

export class UpdateAlertDaysOfWeekDto {
    @IsArray()
    @IsArrayUnique()
    @IsEnum(Weekday, { each: true })
    daysOfWeek!: Weekday[];
}
