import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation";

export class UpdateDailyDateRequestDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly date!: string;
}
