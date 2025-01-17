import { IsUUID } from "class-validator";

export class LinkEntryWithGoalDto {
    @IsUUID("4")
    entryId!: string;
}
