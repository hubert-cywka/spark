import { Transform, Type } from "class-transformer";
import { IsArray, IsDateString, IsOptional, IsUUID } from "class-validator";

import { IsDateOnly } from "@/lib/validation";

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
    readonly from?: string;

    @IsOptional()
    @IsDateOnly()
    @IsDateString({ strict: true })
    readonly to?: string;
}
