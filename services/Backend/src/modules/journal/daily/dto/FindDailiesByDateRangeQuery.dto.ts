import { IsDateString } from "class-validator";

export class FindDailiesByDateRangeQueryDto {
    @IsDateString()
    from!: string;

    @IsDateString()
    to!: string;
}
