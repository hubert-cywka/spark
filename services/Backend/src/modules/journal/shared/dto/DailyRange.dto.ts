import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation";

export class DailyRangeDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly from!: string;

    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly to!: string;
}
