import { IsNumber } from "class-validator";

export class PointsDto {
    @IsNumber()
    target!: number;

    @IsNumber()
    current!: number;
}
