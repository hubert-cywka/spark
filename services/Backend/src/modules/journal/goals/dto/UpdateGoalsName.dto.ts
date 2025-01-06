import { IsString } from "class-validator";

export class UpdateGoalsNameDto {
    @IsString()
    name!: string;
}
