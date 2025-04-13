import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation";
import { type ISODateString } from "@/types/Date";

export class DailyRangeDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly from!: ISODateString;

    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly to!: ISODateString;
}
