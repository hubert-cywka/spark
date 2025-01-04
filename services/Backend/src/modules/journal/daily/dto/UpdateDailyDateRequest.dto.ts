import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation/decorators/IsDateOnly.decorator";

export class UpdateDailyDateRequestDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly date!: string;
}
