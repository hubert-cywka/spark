import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

import { IsDateOnly } from "@/lib/validation";
import { type ISODateString } from "@/types/Date";

export class FindEntriesFiltersDto {
    @IsOptional()
    @IsArray()
    @IsUUID("4", { each: true })
    @Type(() => String)
    @Transform(({ value }) => value.split(","))
    readonly goals?: string[];

    @IsOptional()
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly from?: ISODateString;

    @IsOptional()
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly to?: ISODateString;

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

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    readonly withGoals?: boolean;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    readonly withDaily?: boolean;
}
