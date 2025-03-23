import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";
import { Repository } from "typeorm";

import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { type DailyActivity } from "@/modules/journal/daily/models/DailyActivity.model";
import { DailyInsights } from "@/modules/journal/daily/models/DailyInsights.model";
import { type IDailyInsightsService } from "@/modules/journal/daily/services/interfaces/IDailyInsights.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";
import { getFormattedDailyDate } from "@/modules/journal/shared/utils/getFormattedDailyDate";

@Injectable()
export class DailyInsightsService implements IDailyInsightsService {
    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public async findByDateRange(authorId: string, from: string, to: string): Promise<DailyInsights> {
        const activityHistory = await this.getActivityHistoryByDateRange(authorId, from, to);

        return {
            dailyRange: {
                from,
                to,
            },
            activityHistory,
            totalActiveDays: DailyInsightsService.findTotalActiveDays(activityHistory),
            meanActivityPerDay: DailyInsightsService.findMeanActivityPerDay(activityHistory),
            currentActivityStreak: DailyInsightsService.findActivityStreak(activityHistory, { isCurrent: true }),
            longestActivityStreak: DailyInsightsService.findActivityStreak(activityHistory, { isCurrent: false }),
        };
    }

    private async getActivityHistoryByDateRange(authorId: string, from: string, to: string): Promise<DailyActivity[]> {
        const queryBuilder = this.getRepository()
            .createQueryBuilder("daily")
            .leftJoinAndSelect("daily.entries", "entry")
            .where("daily.date BETWEEN :from AND :to", { from, to })
            .andWhere("daily.authorId = :authorId", { authorId })
            .orderBy("daily.date", "ASC")
            .select(["daily.date AS date", "COUNT(entry.id) AS entriesCount"])
            .groupBy("daily.date");

        const rawResult = await queryBuilder.getRawMany();
        const mappedResult = rawResult.map((row) => ({
            date: row.date,
            entriesCount: parseInt(row.entriescount),
        }));

        return DailyInsightsService.fillGapsInActivityHistory(mappedResult, from, to);
    }

    private static fillGapsInActivityHistory(history: DailyActivity[], from: string, to: string): DailyActivity[] {
        const allDates: string[] = [];
        const currentDate = new Date(from);
        const endDate = new Date(to);

        while (currentDate <= endDate) {
            allDates.push(getFormattedDailyDate(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const dataMap = new Map(history.map((activity) => [activity.date, activity]));

        return allDates.map((date) => {
            return dataMap.get(date) || { date, entriesCount: 0 };
        });
    }

    private static findActivityStreak(activityHistory: DailyActivity[], { isCurrent }: { isCurrent: boolean }) {
        let maxStreak = 0;
        let streak = 0;
        let previousDate: dayjs.Dayjs | null = null;

        const entries = [...activityHistory]
            .filter((entry) => entry.entriesCount > 0)
            .map((entry) => ({ date: dayjs(entry.date) }))
            .reverse();

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

    private static findMeanActivityPerDay(activityHistory: DailyActivity[]) {
        const activities = activityHistory
            .map(({ entriesCount }) => entriesCount)
            .filter((count) => !!count)
            .sort((a, b) => a - b);
        const numberOfEntries = activities.length;

        if (!numberOfEntries) {
            return 0;
        }

        const mid = Math.floor(numberOfEntries / 2);

        return numberOfEntries % 2 !== 0 ? activities[mid] : (activities[mid - 1] + activities[mid]) / 2;
    }

    private getRepository(): Repository<DailyEntity> {
        return this.txHost.tx.getRepository(DailyEntity);
    }
}
