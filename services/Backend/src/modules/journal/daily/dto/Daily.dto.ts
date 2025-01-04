import { IsDateString, IsString, IsUUID } from "class-validator";

export class DailyDto {
    @IsUUID()
    id!: string;

    @IsString()
    authorId!: string;

    @IsDateString()
    date!: string;

    @IsDateString()
    createdAt!: string;

    @IsDateString()
    updatedAt!: string;
}
