import { IsArray, IsString } from "class-validator";

import { DataExportScopeDto } from "@/modules/privacy/dto/DataExportScope.dto";

export class ExportAttachmentManifestDto {
    @IsString()
    readonly key!: string;

    @IsString()
    readonly path!: string;

    @IsString()
    readonly checksum!: string;

    @IsArray()
    readonly scope!: DataExportScopeDto;
}
