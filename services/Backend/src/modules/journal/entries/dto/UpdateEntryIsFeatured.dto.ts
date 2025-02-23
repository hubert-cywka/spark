import { IsBoolean } from "class-validator";

export class UpdateEntryIsFeaturedDto {
    @IsBoolean()
    isFeatured!: boolean;
}
