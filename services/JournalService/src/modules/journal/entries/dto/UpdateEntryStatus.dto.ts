import { IsBoolean } from "class-validator";

export class UpdateEntryStatusDto {
    @IsBoolean()
    isCompleted!: boolean;
}
