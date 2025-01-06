import { Type } from "class-transformer";
import { IsDate } from "class-validator";

import { IsNullable } from "@/lib/validation";

export class UpdateGoalsDeadlineDto {
    @Type(() => Date)
    @IsDate()
    @IsNullable()
    deadline!: Date | null;
}
