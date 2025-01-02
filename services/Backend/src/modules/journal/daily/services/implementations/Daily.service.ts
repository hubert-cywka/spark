import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { And, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";

import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { DailyNotFoundError } from "@/modules/journal/daily/errors/DailyNotFound.error";
import { Daily } from "@/modules/journal/daily/models/Daily.model";
import { IDailyService } from "@/modules/journal/daily/services/interfaces/IDaily.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";
import { type User } from "@/types/User";

// TODO: Map
@Injectable()
export class DailyService implements IDailyService {
    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    public async findAllByDateRange(author: User, from: Date, to: Date): Promise<Daily[]> {
        return await this.getRepository().find({
            where: {
                date: And(LessThanOrEqual(to), MoreThanOrEqual(from)),
                author: { id: author.id },
            },
        });
    }

    public async findOneById(author: User, id: string): Promise<Daily> {
        const repository = this.getRepository();
        const daily = await repository.findOne({
            where: { id, author: { id: author.id } },
        });

        if (!daily) {
            throw new DailyNotFoundError();
        }

        return daily;
    }

    public async create(author: User, date: Date): Promise<Daily> {
        return await this.getRepository().save({
            date,
            author: { id: author.id },
        });
    }

    public async update(author: User, id: string, date: Date): Promise<Daily> {
        const daily = await this.findOneById(author, id);

        if (!daily) {
            throw new DailyNotFoundError();
        }

        return await this.getRepository().save({ id: daily.id, date });
    }

    public async deleteById(author: User, id: string): Promise<void> {
        await this.findOneById(author, id);
        // TODO: Should entries be soft deleted as well?
        await this.getRepository().softDelete({ id });
    }

    private getRepository(): Repository<DailyEntity> {
        return this.txHost.tx.getRepository(DailyEntity);
    }
}
