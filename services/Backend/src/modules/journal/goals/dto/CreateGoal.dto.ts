import { Type } from "class-transformer";
import { IsDate, IsString } from "class-validator";

import { IsNullable } from "@/lib/validation";

export class CreateGoalDto {
    @IsString()
    name!: string;

    @Type(() => Date)
    @IsDate()
    @IsNullable()
    deadline!: Date | null;
}
