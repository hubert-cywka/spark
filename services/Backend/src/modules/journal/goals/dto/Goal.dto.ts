import { IsBoolean, IsDateString, IsString, IsUUID } from "class-validator";

import { IsNullable } from "@/lib/validation";

export class GoalDto {
    @IsUUID("4")
    id!: string;

    @IsUUID("4")
    authorId!: string;

    @IsString()
    name!: string;

    @IsBoolean()
    isAccomplished!: boolean;

    @IsDateString()
    @IsNullable()
    deadline!: string | null;

    @IsDateString()
    createdAt!: string;

    @IsDateString()
    updatedAt!: string;
}
