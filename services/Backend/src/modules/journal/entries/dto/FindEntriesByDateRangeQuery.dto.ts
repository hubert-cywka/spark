import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation";

export class FindEntriesByDateRangeQueryDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly from!: string;

    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly to!: string;
}
