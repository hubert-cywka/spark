import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation";
import { type ISODateString } from "@/types/Date";

export class UpdateDailyDateDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly date!: ISODateString;
}
