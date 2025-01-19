import { IsDateString, IsNumber, IsString, IsUUID } from "class-validator";

import { IsNullable } from "@/lib/validation";

export class GoalDto {
    @IsUUID("4")
    id!: string;

    @IsUUID("4")
    authorId!: string;

    @IsString()
    name!: string;

    @IsNumber()
    target!: number;

    @IsDateString()
    @IsNullable()
    deadline!: string | null;

    @IsDateString()
    createdAt!: string;

    @IsDateString()
    updatedAt!: string;
}
