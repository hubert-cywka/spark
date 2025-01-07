import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString, Min } from "class-validator";

import { IsNullable } from "@/lib/validation";

export class CreateOrUpdateGoalDto {
    @IsString()
    name!: string;

    @IsNumber()
    @Min(1)
    target!: number;

    @Type(() => Date)
    @IsDate()
    @IsNullable()
    deadline!: Date | null;
}
