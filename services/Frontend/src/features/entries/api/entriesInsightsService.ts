import { EntriesMetricsDto } from "@/features/entries/api/dto/EntriesMetricsDto.ts";
import { EntryLoggingHistogramDto } from "@/features/entries/api/dto/EntryLoggingHistogramDto.ts";
import { EntriesMetrics, EntryLoggingHistogram } from "@/features/entries/types/Entry";
import { apiClient } from "@/lib/apiClient/apiClient";

export class EntriesInsightsService {
    public static async getMetrics(from: string, to: string) {
        const { data } = await apiClient.get<EntriesMetricsDto>(`/entry/insights/metrics?from=${from}&to=${to}`);
        return EntriesInsightsService.mapDtoToMetrics(data);
    }

    public static async getLoggingHistogram(from: string, to: string) {
        const { data } = await apiClient.get<EntryLoggingHistogramDto>(`/entry/insights/logging-histogram?from=${from}&to=${to}`);
        return EntriesInsightsService.mapDtoToHistogram(data);
    }

    private static mapDtoToMetrics(dto: EntriesMetricsDto): EntriesMetrics {
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

    private static mapDtoToHistogram(dto: EntryLoggingHistogramDto): EntryLoggingHistogram {
        return {
            dailyRange: dto.dailyRange,
            days: dto.days,
        };
    }
}
