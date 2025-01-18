import { PageDto } from "@/api/dto/PageDto";
import { CreateDailyRequestDto } from "@/features/daily/api/dto/CreateDailyRequestDto";
import { DailyDto } from "@/features/daily/api/dto/DailyDto";
import { UpdateDailyDateRequestDto } from "@/features/daily/api/dto/UpdateDailyDateRequestDto";
import { Daily } from "@/features/daily/types/Daily";
import { apiClient } from "@/lib/apiClient/apiClient";

export class DailyService {
    public static async getPage(from: string, to: string, page: number) {
        const { data } = await apiClient.get<PageDto<DailyDto>>(`/daily?from=${from}&to=${to}&page=${page}&order=DESC`);
        return { ...data, data: data.data.map(DailyService.mapDtoToDaily) };
    }

    public static async getOne(id: string) {
        const { data } = await apiClient.get<DailyDto>(`/daily/${id}`);
        return DailyService.mapDtoToDaily(data);
    }

    public static async createOne(dto: CreateDailyRequestDto) {
        const { data } = await apiClient.post("/daily", dto);
        return DailyService.mapDtoToDaily(data);
    }

    public static async updateDate({ id, ...dto }: UpdateDailyDateRequestDto & { id: string }) {
        const { data } = await apiClient.patch(`/daily/${id}/date`, dto);
        return DailyService.mapDtoToDaily(data);
    }

    public static async deleteOne(id: string) {
        await apiClient.delete(`/daily/${id}`);
    }

    private static mapDtoToDaily(dto: DailyDto): Daily {
        return {
            id: dto.id,
            date: dto.date,
        };
    }
}
