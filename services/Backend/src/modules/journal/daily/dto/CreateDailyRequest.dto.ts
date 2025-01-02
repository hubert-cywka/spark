import { IsDateString } from "class-validator";

export class CreateDailyRequestDto {
    @IsDateString()
    date!: string;
}
