import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation/decorators/IsDateOnly.decorator";

export class FindDailiesByDateRangeQueryDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    from!: string;

    @IsDateOnly()
    @IsDateString({ strict: true })
    to!: string;
}
