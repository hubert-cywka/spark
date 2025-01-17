import { IsDateString, IsOptional } from "class-validator";

import { IsDateOnly } from "@/lib/validation";

export class FindEntriesByDateRangeQueryDto {
    @IsOptional()
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly from?: string;

    @IsOptional()
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly to?: string;
}
