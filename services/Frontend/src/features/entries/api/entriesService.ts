import { PageDto } from "@/api/dto/PageDto";
import { CreateEntryRequestDto } from "@/features/entries/api/dto/CreateEntryRequestDto";
import { EntryDetailDto } from "@/features/entries/api/dto/EntryDetailDto.ts";
import { EntryDto } from "@/features/entries/api/dto/EntryDto";
import { UpdateEntryContentRequestDto } from "@/features/entries/api/dto/UpdateEntryContentRequestDto";
import { UpdateEntryIsFeaturedRequestDto } from "@/features/entries/api/dto/UpdateEntryIsFeaturedRequestDto.ts";
import { UpdateEntryStatusRequestDto } from "@/features/entries/api/dto/UpdateEntryStatusRequestDto";
import { EntriesDetailsQueryFilters } from "@/features/entries/api/types/EntriesDetailsQueryFilters.ts";
import { EntriesQueryFilters } from "@/features/entries/api/types/EntriesQueryFilters";
import { Entry, EntryDetail } from "@/features/entries/types/Entry";
import { apiClient } from "@/lib/apiClient/apiClient";

const PAGE_SIZE = 100;

export class EntriesService {
    public static async getPage(page: number, { from, to, goals, featured, completed }: EntriesQueryFilters = {}) {
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

        if (featured !== undefined) {
            searchParams.append("featured", featured.toString());
        }

        if (completed !== undefined) {
            searchParams.append("completed", completed.toString());
        }

        const { data } = await apiClient.get<PageDto<EntryDto>>(`/entry?${searchParams}`);
        return { ...data, data: data.data.map(EntriesService.mapDtoToEntry) };
    }

    public static async getDetailedPage(page: number, { from, to, goals, featured, completed, content }: EntriesDetailsQueryFilters) {
        const searchParams = new URLSearchParams({
            order: "DESC",
            page: String(page),
            take: String(PAGE_SIZE),
        });

        searchParams.append("from", from);
        searchParams.append("to", to);

        if (content) {
            searchParams.append("content", content);
        }

        if (goals) {
            searchParams.append("goals", goals.join(","));
        }

        if (featured !== undefined) {
            searchParams.append("featured", featured.toString());
        }

        if (completed !== undefined) {
            searchParams.append("completed", completed.toString());
        }

        const { data } = await apiClient.get<PageDto<EntryDetailDto>>(`/entry/details?${searchParams}`);
        return {
            ...data,
            data: data.data.map(EntriesService.mapDtoToEntryDetails),
        };
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

    public static async updateIsFeatured({
        entryId,
        dailyId,
        ...dto
    }: UpdateEntryIsFeaturedRequestDto & { entryId: string; dailyId: string }) {
        const { data } = await apiClient.patch(`/daily/${dailyId}/entry/${entryId}/featured`, dto);
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
            isFeatured: dto.isFeatured,
            createdAt: new Date(dto.createdAt),
        };
    }

    private static mapDtoToEntryDetails(dto: EntryDetailDto): EntryDetail {
        return {
            id: dto.id,
            content: dto.content,
            isCompleted: dto.isCompleted,
            isFeatured: dto.isFeatured,
            goals: dto.goals,
            daily: dto.daily,
        };
    }
}
