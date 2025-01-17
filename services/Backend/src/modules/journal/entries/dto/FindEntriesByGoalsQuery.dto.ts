import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, IsUUID } from "class-validator";

export class FindEntriesByGoalsQueryDto {
    @IsOptional()
    @IsArray()
    @IsUUID("4", { each: true })
    @Type(() => String)
    @Transform(({ value }) => value.split(","))
    readonly goals?: string[];
}
