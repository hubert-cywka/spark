import { IsArray, IsDate, IsObject, IsString } from "class-validator";

import { IsNullable } from "@/lib/validation";
import { DataExportScopeDto } from "@/modules/exports/dto/DataExportScope.dto";

export class DataExportDto {
    @IsString()
    readonly id!: string;

    @IsArray()
    @IsObject({ each: true })
    readonly targetScopes!: DataExportScopeDto[];

    @IsDate()
    readonly startedAt!: Date;

    @IsDate()
    readonly validUntil!: Date;

    @IsDate()
    @IsNullable()
    readonly cancelledAt!: Date | null;

    @IsDate()
    @IsNullable()
    readonly completedAt!: Date | null;
}
