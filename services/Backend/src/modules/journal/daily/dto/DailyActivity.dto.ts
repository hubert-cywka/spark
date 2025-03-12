import { IsDateString, IsNumber, IsUUID } from "class-validator";

export class DailyActivityDto {
    @IsUUID("4")
    id!: string;

    @IsDateString()
    date!: string;

    @IsNumber()
    entriesCount!: number;
}
