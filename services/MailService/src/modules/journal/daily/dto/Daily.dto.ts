import { IsDateString, IsUUID } from "class-validator";

export class DailyDto {
    @IsUUID("4")
    id!: string;

    @IsUUID("4")
    authorId!: string;

    @IsDateString()
    date!: string;

    @IsDateString()
    createdAt!: string;

    @IsDateString()
    updatedAt!: string;
}
