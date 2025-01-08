import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

import { IsNullable } from "@/lib/validation";

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 90;

const MIN_TARGET = 1;
const MAX_TARGET = 1000;

export class CreateOrUpdateGoalDto {
    @IsString()
    @MinLength(MIN_NAME_LENGTH)
    @MaxLength(MAX_NAME_LENGTH)
    name!: string;

    @IsNumber()
    @Min(MIN_TARGET)
    @Max(MAX_TARGET)
    target!: number;

    @Type(() => Date)
    @IsDate()
    @IsNullable()
    deadline!: Date | null;
}
