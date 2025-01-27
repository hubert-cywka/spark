import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateEntryContentDto {
    @IsString()
    @MaxLength(1024)
    @MinLength(1)
    content!: string;
}
