import { Expose } from "class-transformer";
import { IsDateString, IsString } from "class-validator";

export class DailyDto {
    @Expose()
    @IsString()
    id!: string;

    @Expose()
    @IsDateString()
    date!: string;

    @Expose()
    @IsDateString()
    createdAt!: string;

    @Expose()
    @IsDateString()
    updatedAt!: string;
}
