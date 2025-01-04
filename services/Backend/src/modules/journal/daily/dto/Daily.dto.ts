import { IsDateString, IsString } from "class-validator";

export class DailyDto {
    @IsString()
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
