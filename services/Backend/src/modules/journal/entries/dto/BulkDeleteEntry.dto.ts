import { ArrayMaxSize, ArrayMinSize, IsArray, IsUUID } from "class-validator";

export class BulkDeleteEntryDto {
    @IsArray()
    @IsUUID("4", { each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(500)
    readonly ids!: string[];
}
