import { DataExportScopeDto } from "@/modules/privacy/dto/DataExportScope.dto";

export class StartDataExportDto {
    readonly targetScopes!: DataExportScopeDto[];
}
