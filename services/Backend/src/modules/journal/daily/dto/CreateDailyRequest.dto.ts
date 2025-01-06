import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation";

export class CreateDailyRequestDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly date!: string;
}
