import { IsDateString } from "class-validator";

export class UpdateDailyDateRequestDto {
    @IsDateString()
    date!: string;
}
