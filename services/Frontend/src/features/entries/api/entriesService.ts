import { PageDto } from "@/api/dto/PageDto";
import { CreateEntryRequestDto } from "@/features/entries/api/dto/CreateEntryRequestDto";
import { EntryDto } from "@/features/entries/api/dto/EntryDto";
import { UpdateEntryContentRequestDto } from "@/features/entries/api/dto/UpdateEntryContentRequestDto";
import { UpdateEntryStatusRequestDto } from "@/features/entries/api/dto/UpdateEntryStatusRequestDto";
import { EntriesQueryFilters } from "@/features/entries/api/types/EntriesQueryFilters";
import { Entry } from "@/features/entries/types/Entry";
import { apiClient } from "@/lib/apiClient/apiClient";

const PAGE_SIZE = 100;

export class EntriesService {
    public static async getPage(page: number, { from, to, goals }: EntriesQueryFilters = {}) {
        const searchParams = new URLSearchParams({
            order: "DESC",
            page: String(page),
            take: String(PAGE_SIZE),
        });

        if (from) {
            searchParams.append("from", from);
        }

        if (to) {
            searchParams.append("to", to);
        }

        if (goals) {
            searchParams.append("goals", goals.join(","));
        }

        const { data } = await apiClient.get<PageDto<EntryDto>>(`/entry?${searchParams}`);
        return { ...data, data: data.data.map(EntriesService.mapDtoToEntry) };
    }

    public static async createOne({ dailyId, ...dto }: CreateEntryRequestDto & { dailyId: string }) {
        const { data } = await apiClient.post(`/daily/${dailyId}/entry`, dto);
        return EntriesService.mapDtoToEntry(data);
    }

    public static async updateContent({ entryId, dailyId, ...dto }: UpdateEntryContentRequestDto & { entryId: string; dailyId: string }) {
        const { data } = await apiClient.patch(`/daily/${dailyId}/entry/${entryId}/content`, dto);
        return EntriesService.mapDtoToEntry(data);
    }

    public static async updateStatus({ entryId, dailyId, ...dto }: UpdateEntryStatusRequestDto & { entryId: string; dailyId: string }) {
        const { data } = await apiClient.patch(`/daily/${dailyId}/entry/${entryId}/completed`, dto);
        return EntriesService.mapDtoToEntry(data);
    }

    public static async deleteOne({ entryId, dailyId }: { entryId: string; dailyId: string }) {
        await apiClient.delete(`/daily/${dailyId}/entry/${entryId}`);
    }

    private static mapDtoToEntry(dto: EntryDto): Entry {
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
