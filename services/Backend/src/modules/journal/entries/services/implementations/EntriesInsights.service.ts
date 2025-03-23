import { Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { EntriesInsights } from "@/modules/journal/entries/models/EntriesInsights.model";
import { type IEntriesInsightsService } from "@/modules/journal/entries/services/interfaces/IEntriesInsights.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

export class EntriesInsightsService implements IEntriesInsightsService {
    private readonly logger = new Logger(EntriesInsightsService.name);

    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public async findByDateRange(authorId: string, from: string, to: string): Promise<EntriesInsights> {
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
            dailyRange: { from, to },
            totalEntriesAmount,
            featuredEntriesAmount,
            completedEntriesAmount,
            pendingEntriesAmount: totalEntriesAmount - featuredEntriesAmount,
            featuredEntriesRatio: totalEntriesAmount > 0 ? (featuredEntriesAmount / totalEntriesAmount) * 100 : 0,
            completedEntriesRatio: totalEntriesAmount > 0 ? (completedEntriesAmount / totalEntriesAmount) * 100 : 0,
        };
    }

    private getRepository(): Repository<EntryEntity> {
        return this.txHost.tx.getRepository(EntryEntity);
    }
}
