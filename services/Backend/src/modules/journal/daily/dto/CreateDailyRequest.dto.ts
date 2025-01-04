import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation/decorators/IsDateOnly.decorator";

export class CreateDailyRequestDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    date!: string;
}
