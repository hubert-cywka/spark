import { IsArray } from "class-validator";

import { IsArrayUnique } from "@/lib/validation/decorators/IsArrayUnique.decorator";
import { IsISOTime } from "@/lib/validation/decorators/IsISOTime.decorator";
import { IsUTCDay } from "@/lib/validation/decorators/IsUTCDay.decorator";
import { UTCDay } from "@/modules/alerts/types/UTCDay";

export class UpdateAlertTimeDto {
    @IsISOTime()
    time!: string;

    @IsArray()
    @IsArrayUnique()
    @IsUTCDay({ each: true })
    daysOfWeek!: UTCDay[];
}
