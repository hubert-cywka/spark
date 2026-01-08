import { IsDateString } from "class-validator";

import { IsDateOnly } from "@/lib/validation";
import type { ISODateString } from "@/types/Date";

export class UpdateEntryDateDto {
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly date!: ISODateString;
}
