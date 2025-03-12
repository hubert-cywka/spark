import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { type IDailyActivityService } from "@/modules/journal/daily/services/interfaces/IDailyActivity.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

@Injectable()
export class DailyActivityService implements IDailyActivityService {
    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public async getByDateRange(authorId: string, from: string, to: string): Promise<{ date: string; id: string; entriesCount: number }[]> {
        const queryBuilder = this.getRepository()
            .createQueryBuilder("daily")
            .leftJoinAndSelect("daily.entries", "entry")
            .where("daily.date BETWEEN :from AND :to", { from, to })
            .andWhere("daily.authorId = :authorId", { authorId })
            .orderBy("daily.date", "ASC")
            .select(["daily.id AS id", "daily.date AS date", "COUNT(entry.id) AS entriesCount"])
            .groupBy("daily.id");

        const result = await queryBuilder.getRawMany();
        return result.map((row) => ({
            id: row.id,
            date: row.date,
            entriesCount: row.entriescount,
        }));
    }

    private getRepository(): Repository<DailyEntity> {
        return this.txHost.tx.getRepository(DailyEntity);
    }
}
