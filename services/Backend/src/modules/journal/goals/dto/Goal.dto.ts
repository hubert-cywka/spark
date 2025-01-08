import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsString, IsUUID, ValidateNested } from "class-validator";

import { IsNullable } from "@/lib/validation";
import { PointsDto } from "@/modules/journal/goals/dto/Points.dto";

export class GoalDto {
    @IsUUID("4")
    id!: string;

    @IsUUID("4")
    authorId!: string;

    @IsString()
    name!: string;

    @IsBoolean()
    isAccomplished!: boolean;

    @ValidateNested()
    @Type(() => PointsDto)
    points!: PointsDto;

    @IsDateString()
    @IsNullable()
    deadline!: string | null;

    @IsDateString()
    createdAt!: string;

    @IsDateString()
    updatedAt!: string;
}
