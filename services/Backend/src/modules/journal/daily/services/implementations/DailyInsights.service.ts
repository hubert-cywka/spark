import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";
import { Repository } from "typeorm";

import { isOutsideDateRange } from "@/common/utils/dateUtils";
import { mean } from "@/common/utils/mathUtils";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { type DailyActivity } from "@/modules/journal/daily/models/DailyActivity.model";
import { DailyInsights } from "@/modules/journal/daily/models/DailyInsights.model";
import { type IDailyInsightsService } from "@/modules/journal/daily/services/interfaces/IDailyInsights.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";
import { getFormattedDailyDate } from "@/modules/journal/shared/utils/getFormattedDailyDate";
import { ISODateStringRange } from "@/types/Date";

@Injectable()
export class DailyInsightsService implements IDailyInsightsService {
    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public async findByDateRange(authorId: string, dateRange: ISODateStringRange, timezone: string = "UTC"): Promise<DailyInsights> {
        const activityHistory = await this.getActivityHistoryByDateRange(authorId, dateRange);

        const currentActivityStreak = !isOutsideDateRange(dateRange, timezone)
            ? DailyInsightsService.findActivityStreak(activityHistory, {
                  isCurrent: true,
                  timezone,
              })
            : null;

        return {
            dailyRange: dateRange,
            activityHistory,
            currentActivityStreak,
            longestActivityStreak: DailyInsightsService.findActivityStreak(activityHistory, { isCurrent: false, timezone }),
            totalActiveDays: DailyInsightsService.findTotalActiveDays(activityHistory),
            activeDayRate: DailyInsightsService.findActiveDayRate(activityHistory),
            meanActivityPerDay: DailyInsightsService.findMeanActivityPerDay(activityHistory),
        };
    }

    private async getActivityHistoryByDateRange(authorId: string, dateRange: ISODateStringRange): Promise<DailyActivity[]> {
        const queryBuilder = this.getRepository()
            .createQueryBuilder("daily")
            .leftJoinAndSelect("daily.entries", "entry")
            .where("daily.date BETWEEN :from AND :to", dateRange)
            .andWhere("daily.authorId = :authorId", { authorId })
            .orderBy("daily.date", "ASC")
            .select(["daily.date AS date", "COUNT(entry.id) AS entriesCount"])
            .groupBy("daily.date");

        const rawResult = await queryBuilder.getRawMany();
        const mappedResult = rawResult.map((row) => ({
            date: row.date,
            entriesCount: parseInt(row.entriescount),
        }));

        return DailyInsightsService.fillGapsInActivityHistory(mappedResult, dateRange);
    }

    private static fillGapsInActivityHistory(history: DailyActivity[], { from, to }: ISODateStringRange): DailyActivity[] {
        const allDates: string[] = [];
        let currentDate = dayjs.utc(from);
        const endDate = dayjs.utc(to);

        while (currentDate.isSame(endDate) || currentDate.isBefore(endDate)) {
            allDates.push(getFormattedDailyDate(currentDate.toDate()));
            currentDate = currentDate.add(1, "day");
        }

        const dataMap = new Map(history.map((activity) => [activity.date, activity]));

        return allDates.map((date) => {
            return dataMap.get(date) || { date, entriesCount: 0 };
        });
    }

    private static findActivityStreak(activityHistory: DailyActivity[], { isCurrent, timezone }: { isCurrent: boolean; timezone: string }) {
        let maxStreak = 0;
        let streak = 0;
        let previousDate: dayjs.Dayjs | null = null;

        const entries = [...activityHistory]
            .filter((entry) => entry.entriesCount > 0)
            .map((entry) => ({ date: dayjs.tz(entry.date, timezone) }))
            .reverse();

        const now = dayjs().tz(timezone);
        if (isCurrent && (!entries.length || !entries[0].date.isSame(now, "day"))) {
            return 0;
        }

        for (const entry of entries) {
            if (!previousDate) {
                previousDate = entry.date;
                streak = 1;
                continue;
            }

            const diffInDays = previousDate.diff(entry.date, "day");

            if (diffInDays === 1) {
                streak++;
            } else if (diffInDays > 1) {
                maxStreak = Math.max(maxStreak, streak);
                if (isCurrent) {
                    return streak;
                }
                streak = 1;
            }

            previousDate = entry.date;
        }

        return Math.max(maxStreak, streak);
    }

    private static findTotalActiveDays(activityHistory: DailyActivity[]) {
        return activityHistory.filter(({ entriesCount }) => entriesCount).length;
    }

    private static findActiveDayRate(activityHistory: DailyActivity[]) {
        return (DailyInsightsService.findTotalActiveDays(activityHistory) / activityHistory.length) * 100;
    }

    private static findMeanActivityPerDay(activityHistory: DailyActivity[]) {
        const activities = activityHistory
            .map(({ entriesCount }) => entriesCount)
            .filter((count) => !!count)
            .sort((a, b) => a - b);

        return mean(...activities);
    }

    private getRepository(): Repository<DailyEntity> {
        return this.txHost.tx.getRepository(DailyEntity);
    }
}
