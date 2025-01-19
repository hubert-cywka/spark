import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";

export class FindGoalsFiltersDto {
    @IsOptional()
    @IsArray()
    @IsUUID("4", { each: true })
    @Type(() => String)
    @Transform(({ value }) => value.split(","))
    readonly entries?: string[];

    @IsOptional()
    @IsArray()
    @IsUUID("4", { each: true })
    @Type(() => String)
    @Transform(({ value }) => value.split(","))
    readonly excludeEntries?: string[];

    @IsOptional()
    @IsString()
    readonly name?: string;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    readonly withProgress?: boolean;
}
