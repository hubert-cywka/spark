import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

import { IsDateOnly } from "@/lib/validation";
import type { ISODateString } from "@/types/Date";

export class FindEntryDetailsFiltersDto {
    @IsOptional()
    @IsArray()
    @IsUUID("4", { each: true })
    @Type(() => String)
    @Transform(({ value }) => value.split(","))
    readonly goals?: string[];

    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly from!: ISODateString;

    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly to!: ISODateString;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
    })
    readonly featured?: boolean;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return value;
    })
    readonly completed?: boolean;

    @IsOptional()
    @IsString()
    readonly content?: string;
}
