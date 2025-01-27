import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation";

export class UpdateDailyDateDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly date!: string;
}
