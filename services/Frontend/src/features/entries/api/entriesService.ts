import { PageDto } from "@/api/dto/PageDto";
import { CreateEntryRequestDto } from "@/features/entries/api/dto/CreateEntryRequestDto";
import { EntryDto } from "@/features/entries/api/dto/EntryDto";
import { UpdateEntryContentRequestDto } from "@/features/entries/api/dto/UpdateEntryContentRequestDto";
import { UpdateEntryStatusRequestDto } from "@/features/entries/api/dto/UpdateEntryStatusRequestDto";
import { Entry } from "@/features/entries/types/Entry";
import { apiClient } from "@/lib/apiClient/apiClient";

export class EntriesService {
    public static async getPageByDateRange(from: string, to: string, page: number) {
        const { data } = await apiClient.get<PageDto<EntryDto>>(`/entry?from=${from}&to=${to}&page=${page}&take=${100}&order=DESC`);
        return { ...data, data: data.data.map(EntriesService.mapDtoToGoal) };
    }

    public static async createOne({ dailyId, ...dto }: CreateEntryRequestDto & { dailyId: string }) {
        const { data } = await apiClient.post(`/daily/${dailyId}/entry`, dto);
        return EntriesService.mapDtoToGoal(data);
    }

    public static async updateContent({ entryId, dailyId, ...dto }: UpdateEntryContentRequestDto & { entryId: string; dailyId: string }) {
        const { data } = await apiClient.patch(`/daily/${dailyId}/entry/${entryId}/content`, dto);
        return EntriesService.mapDtoToGoal(data);
    }

    public static async updateStatus({ entryId, dailyId, ...dto }: UpdateEntryStatusRequestDto & { entryId: string; dailyId: string }) {
        const { data } = await apiClient.patch(`/daily/${dailyId}/entry/${entryId}/completed`, dto);
        return EntriesService.mapDtoToGoal(data);
    }

    public static async deleteOne({ entryId, dailyId }: { entryId: string; dailyId: string }) {
        await apiClient.delete(`/daily/${dailyId}/entry/${entryId}`);
    }

    private static mapDtoToGoal(dto: EntryDto): Entry {
        return {
            id: dto.id,
            dailyId: dto.dailyId,
            authorId: dto.authorId,
            content: dto.content,
            isCompleted: dto.isCompleted,
            createdAt: new Date(dto.createdAt),
        };
    }
}
