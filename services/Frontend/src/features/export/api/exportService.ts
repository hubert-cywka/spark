import { PageDto } from "@/api/dto/PageDto.ts";
import { DataExportEntryDto } from "@/features/export/api/dto/DataExportEntryDto.ts";
import { StartDataExportDto } from "@/features/export/api/dto/StartDataExportDto.ts";
import { DataExportEntry, DataExportStatus } from "@/features/export/types/DataExport";
import { apiClient } from "@/lib/apiClient/apiClient";
import { downloadBlob } from "@/utils/download.ts";

const PAGE_SIZE = 5;

export class ExportService {
    public static async getMostRecentOnes() {
        const searchParams = new URLSearchParams({
            order: "DESC",
            page: String(1),
            take: String(PAGE_SIZE),
        });

        const { data } = await apiClient.get<PageDto<DataExportEntryDto>>(`/export?${searchParams}`);
        return data.data.map(ExportService.mapDtoToExportEntry);
    }

    public static async start(dto: StartDataExportDto) {
        await apiClient.post("/export", dto);
    }

    public static async cancel(id: string) {
        await apiClient.delete(`/export/${id}`);
    }

    public static async download(id: string) {
        const { data } = await apiClient.get<Blob>(`/export/${id}/files`, {
            responseType: "blob",
        });

        downloadBlob(`export-${id}.zip`, data);
    }

    private static mapDtoToExportEntry(dto: DataExportEntryDto): DataExportEntry {
        return {
            id: dto.id,
            targetScopes: dto.targetScopes.map((scope) => ({
                domain: scope.domain,
                dateRange: {
                    from: new Date(scope.dateRange.from),
                    to: new Date(scope.dateRange.to),
                },
            })),
            startedAt: new Date(dto.startedAt),
            status: ExportService.getStatus(dto),
        };
    }

    private static getStatus(dto: DataExportEntryDto): DataExportStatus {
        if (dto.completedAt) {
            return "completed";
        }

        if (dto.cancelledAt) {
            return "cancelled";
        }

        return "pending";
    }
}
