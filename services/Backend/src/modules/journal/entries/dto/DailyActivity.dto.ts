import { IsDateString, IsNumber } from "class-validator";

export class DailyActivityDto {
    @IsDateString()
    date!: string;

    @IsNumber()
    entriesCount!: number;
}
