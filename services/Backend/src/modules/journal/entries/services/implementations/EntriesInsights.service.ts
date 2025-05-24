import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { EntriesInsights } from "@/modules/journal/entries/models/EntriesInsights.model";
import { type IEntriesInsightsService } from "@/modules/journal/entries/services/interfaces/IEntriesInsights.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

export class EntriesInsightsService implements IEntriesInsightsService {
    public constructor(
        @InjectRepository(EntryEntity, JOURNAL_MODULE_DATA_SOURCE)
        private readonly repository: Repository<EntryEntity>
    ) {}

    public async findMetricsByDateRange(authorId: string, from: string, to: string): Promise<EntriesInsights> {
        const result = await this.getRepository()
            .createQueryBuilder("entry")
            .innerJoin("entry.daily", "daily")
            .where("entry.authorId = :authorId", { authorId })
            .andWhere("daily.date >= :from", { from })
            .andWhere("daily.date <= :to", { to })
            .select([
                "COUNT(entry.id) AS totalEntriesAmount",
                "SUM(CASE WHEN entry.isFeatured = true THEN 1 ELSE 0 END) AS featuredEntriesAmount",
                "SUM(CASE WHEN entry.isCompleted = true THEN 1 ELSE 0 END) AS completedEntriesAmount",
            ])
            .getRawOne();

        const totalEntriesAmount = parseInt(result.totalentriesamount) || 0;
        const featuredEntriesAmount = parseInt(result.featuredentriesamount) || 0;
        const completedEntriesAmount = parseInt(result.completedentriesamount) || 0;

        return {
            totalEntriesAmount,
            featuredEntriesAmount,
            completedEntriesAmount,
            pendingEntriesAmount: totalEntriesAmount - completedEntriesAmount,
            featuredEntriesRatio: totalEntriesAmount > 0 ? (featuredEntriesAmount / totalEntriesAmount) * 100 : 0,
            completedEntriesRatio: totalEntriesAmount > 0 ? (completedEntriesAmount / totalEntriesAmount) * 100 : 0,
        };
    }

    public async findLoggingHistogram(authorId: string, from: string, to: string, timezone: string): Promise<EntryLoggingHistogram> {
        const histogramResult = await this.getRepository()
            .createQueryBuilder("entry")
            .innerJoin("entry.daily", "daily")
            .where("entry.authorId = :authorId", { authorId })
            .andWhere("daily.date >= :from", { from })
            .andWhere("daily.date <= :to", { to })
            .select([
                "EXTRACT(DOW FROM entry.createdAt AT TIME ZONE :timezone AT TIME ZONE 'UTC') AS dayOfWeek",
                "EXTRACT(HOUR FROM entry.createdAt AT TIME ZONE :timezone AT TIME ZONE 'UTC') AS hour",
                "COUNT(entry.id) AS count",
            ])
            .setParameter("timezone", timezone)
            .groupBy("1, 2")
            .orderBy("dayOfWeek, hour")
            .getRawMany();

        const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];
        const result: EntryLoggingHistogram = [];

        for (const dayOfWeek of daysOfWeek) {
            const hours = Array.from({ length: 24 }, (_, hour) => ({
                hour,
                count: 0,
            }));

            histogramResult
                .filter((row) => parseInt(row.dayofweek) === dayOfWeek)
                .forEach((row) => {
                    const hour = parseInt(row.hour);
                    hours[hour].count = parseInt(row.count) || 0;
                });

            result.push({
                dayOfWeek,
                hours,
            });
        }

        return result;
    }

    private getRepository(): Repository<EntryEntity> {
        return this.repository;
    }
}
