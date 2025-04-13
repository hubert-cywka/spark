import { DailyActivityDto } from "@/features/daily/api/dto/DailyActivityDto.ts";
import { DailyMetricsDto } from "@/features/daily/api/dto/DailyMetricsDto.ts";
import { DailyActivity, DailyMetrics } from "@/features/daily/types/Daily";
import { apiClient } from "@/lib/apiClient/apiClient";

export class DailyInsightsService {
    public static async getMetrics(from: string, to: string) {
        const { data } = await apiClient.get<DailyMetricsDto>(`/daily/metrics?from=${from}&to=${to}`);
        return DailyInsightsService.mapDtoToMetrics(data);
    }

    private static mapDtoToMetrics(dto: DailyMetricsDto): DailyMetrics {
        return {
            dailyRange: dto.dailyRange,
            activityHistory: dto.activityHistory.map(DailyInsightsService.mapDtoToDailyActivity),
            currentActivityStreak: dto.currentActivityStreak,
            longestActivityStreak: dto.longestActivityStreak,
            meanActivityPerDay: dto.meanActivityPerDay,
            totalActiveDays: dto.totalActiveDays,
            activeDayRate: dto.activeDayRate,
        };
    }

    private static mapDtoToDailyActivity(dto: DailyActivityDto): DailyActivity {
        return {
            date: dto.date,
            entriesCount: dto.entriesCount,
        };
    }
}
