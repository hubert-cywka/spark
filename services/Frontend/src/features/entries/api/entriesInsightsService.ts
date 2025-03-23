import { DailyActivityDto } from "@/features/daily/api/dto/DailyActivityDto.ts";
import { DailyActivity } from "@/features/daily/types/Daily";
import { getFormattedDailyDate } from "@/features/daily/utils/dateUtils.ts";
import { apiClient } from "@/lib/apiClient/apiClient";

export class DailyInsightsService {
    // TODO: Adjust to newer response format
    public static async getInsights(from: string, to: string) {
        const { data } = await apiClient.get<DailyActivityDto[]>(`/daily/insights?from=${from}&to=${to}`);
        const activities = data.map(DailyInsightsService.mapDtoToDailyActivity);

        const allDates: string[] = [];
        const currentDate = new Date(from);
        const endDate = new Date(to);

        while (currentDate <= endDate) {
            allDates.push(getFormattedDailyDate(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const dataMap = new Map(activities.map((activity) => [activity.date, activity]));

        return allDates.map((date) => {
            return dataMap.get(date) || { date, id: null, entriesCount: 0 };
        });
    }

    private static mapDtoToDailyActivity(dto: DailyActivityDto): DailyActivity {
        return {
            date: dto.date,
            entriesCount: dto.entriesCount,
        };
    }
}
