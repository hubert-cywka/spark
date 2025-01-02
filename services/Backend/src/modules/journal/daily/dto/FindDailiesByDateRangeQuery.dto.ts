import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation/decorators/IsDateOnly.decorator";

export class FindDailiesByDateRangeQueryDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly from: string;

    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly to: string;

    constructor({ from, to }: { to: string; from: string }) {
        this.to = to;
        this.from = from;
    }
}
