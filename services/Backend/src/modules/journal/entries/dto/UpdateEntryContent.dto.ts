import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateEntryContentDto {
    @IsString()
    @MinLength(1)
    @MaxLength(1024)
    content!: string;
}
