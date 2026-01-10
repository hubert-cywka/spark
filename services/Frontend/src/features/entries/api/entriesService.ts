import { PageDto } from "@/api/dto/PageDto";
import { PageCursor } from "@/api/types/PageCursor.ts";
import { BulkDeleteEntryRequestDto } from "@/features/entries/api/dto/BulkDeleteEntryRequestDto.ts";
import { BulkUpdateEntryRequestDto } from "@/features/entries/api/dto/BulkUpdateEntryRequestDto.ts";
import { CreateEntryRequestDto } from "@/features/entries/api/dto/CreateEntryRequestDto";
import { EntryDto } from "@/features/entries/api/dto/EntryDto";
import { UpdateEntryRequestDto } from "@/features/entries/api/dto/UpdateEntryRequestDto.ts";
import { EntriesQueryFilters } from "@/features/entries/api/types/EntriesQueryFilters";
import { Entry } from "@/features/entries/types/Entry";
import { apiClient } from "@/lib/apiClient/apiClient";

const PAGE_SIZE = 100;

export class EntriesService {
    public static async getPage(
        cursor: PageCursor,
        { from, to, goals, featured, completed, content, includeGoals }: EntriesQueryFilters = {}
    ) {
        const searchParams = new URLSearchParams({
            order: "DESC",
            take: String(PAGE_SIZE),
        });

        if (includeGoals) {
            searchParams.append("includeGoals", "true");
        }

        if (cursor) {
            searchParams.append("cursor", cursor);
        }

        if (from) {
            searchParams.append("from", from);
        }

        if (to) {
            searchParams.append("to", to);
        }

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

        const { data } = await apiClient.get<PageDto<EntryDto>>(`/entry?${searchParams}`);
        return { ...data, data: data.data.map(EntriesService.mapDtoToEntry) };
    }

    public static async createOne(dto: CreateEntryRequestDto) {
        const { data } = await apiClient.post("/entry", dto);
        return EntriesService.mapDtoToEntry(data);
    }

    public static async updateOne({ entryId, ...dto }: UpdateEntryRequestDto & { entryId: string }) {
        const { data } = await apiClient.patch(`/entry/${entryId}`, dto);
        return EntriesService.mapDtoToEntry(data);
    }

    public static async updateMany(dto: BulkUpdateEntryRequestDto) {
        const { data } = await apiClient.patch("/entry", dto);
        return EntriesService.mapDtoToEntry(data);
    }

    public static async deleteMany(dto: BulkDeleteEntryRequestDto) {
        const { data } = await apiClient.post("/entry/delete-requests", dto);
        return EntriesService.mapDtoToEntry(data);
    }

    public static async deleteOne({ entryId }: { entryId: string }) {
        await apiClient.delete(`/entry/${entryId}`);
    }

    private static mapDtoToEntry(dto: EntryDto): Entry {
        return {
            id: dto.id,
            date: dto.date,
            authorId: dto.authorId,
            content: dto.content,
            isCompleted: dto.isCompleted,
            isFeatured: dto.isFeatured,
            createdAt: new Date(dto.createdAt),
            updatedAt: new Date(dto.updatedAt),
            goals: dto.goals,
        };
    }
}
