import { DailyActivityDto } from "@/features/daily/api/dto/DailyActivityDto.ts";
import { DailyInsightsDto } from "@/features/daily/api/dto/DailyInsightsDto";
import { DailyActivity, DailyInsights } from "@/features/daily/types/Daily";
import { apiClient } from "@/lib/apiClient/apiClient";

export class DailyInsightsService {
    public static async getInsights(from: string, to: string) {
        const { data } = await apiClient.get<DailyInsightsDto>(`/daily/insights?from=${from}&to=${to}`);
        return DailyInsightsService.mapDtoToInsights(data);
    }

    private static mapDtoToInsights(dto: DailyInsightsDto): DailyInsights {
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
