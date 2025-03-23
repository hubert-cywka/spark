import { EntriesInsightsDto } from "@/features/entries/api/dto/EntriesInsightsDto";
import { EntriesInsights } from "@/features/entries/types/Entry";
import { apiClient } from "@/lib/apiClient/apiClient";

export class EntriesInsightsService {
    public static async getInsights(from: string, to: string) {
        const { data } = await apiClient.get<EntriesInsightsDto>(`/entry/insights?from=${from}&to=${to}`);
        return EntriesInsightsService.mapDtoToInsights(data);
    }

    private static mapDtoToInsights(dto: EntriesInsightsDto): EntriesInsights {
        return {
            dailyRange: dto.dailyRange,
            completedEntriesAmount: dto.completedEntriesAmount,
            completedEntriesRatio: dto.completedEntriesRatio,
            featuredEntriesAmount: dto.featuredEntriesAmount,
            featuredEntriesRatio: dto.featuredEntriesRatio,
            pendingEntriesAmount: dto.pendingEntriesAmount,
            totalEntriesAmount: dto.totalEntriesAmount,
        };
    }
}
