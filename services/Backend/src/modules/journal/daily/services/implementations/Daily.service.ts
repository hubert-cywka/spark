import { Inject, Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { PageMetaDto } from "@/common/pagination/dto/PageMeta.dto";
import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { DailyNotFoundError } from "@/modules/journal/daily/errors/DailyNotFound.error";
import { type IDailyMapper, DailyMapperToken } from "@/modules/journal/daily/mappers/IDaily.mapper";
import { Daily } from "@/modules/journal/daily/models/Daily.model";
import { IDailyService } from "@/modules/journal/daily/services/interfaces/IDaily.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";
import { type User } from "@/types/User";

@Injectable()
export class DailyService implements IDailyService {
    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(DailyMapperToken)
        private readonly dailyMapper: IDailyMapper
    ) {}

    public async findAllByDateRange(author: User, from: string, to: string, pageOptions: PageOptions): Promise<Paginated<Daily>> {
        const queryBuilder = this.getRepository().createQueryBuilder("daily");

        queryBuilder.orderBy("daily.date", pageOptions.order).skip(pageOptions.skip).take(pageOptions.take);
        const itemCount = await queryBuilder.getCount();

        const dailies = await queryBuilder
            .where("daily.date BETWEEN :from AND :to", { from, to })
            .andWhere("daily.authorId = :authorId", { authorId: author.id })
            .getMany();

        // TODO: Do not use DTOs here
        return {
            data: this.dailyMapper.fromEntityToModelBulk(dailies),
            meta: new PageMetaDto({
                itemCount,
                page: pageOptions.page,
                take: pageOptions.take,
            }),
        };
    }

    public async findOneById(author: User, id: string): Promise<Daily> {
        const repository = this.getRepository();
        const daily = await repository.findOne({
            where: { id, author: { id: author.id } },
        });

        if (!daily) {
            throw new DailyNotFoundError();
        }

        return this.dailyMapper.fromEntityToModel(daily);
    }

    public async create(author: User, date: string): Promise<Daily> {
        const result = await this.getRepository()
            .createQueryBuilder("daily")
            .insert()
            .into(DailyEntity)
            .values({
                date,
                author: { id: author.id },
            })
            .returning("*")
            .execute();

        const insertedEntity = result.raw[0];
        return this.dailyMapper.fromEntityToModel(insertedEntity);
    }

    public async update(author: User, id: string, date: string): Promise<Daily> {
        const result = await this.getRepository()
            .createQueryBuilder("daily")
            .update(DailyEntity)
            .set({ date })
            .where("daily.id = :dailyId AND author.id = :authorId", {
                dailyId: id,
                authorId: author.id,
            })
            .returning("*")
            .execute();

        const updatedEntity = result.raw[0];

        if (!updatedEntity) {
            throw new DailyNotFoundError();
        }

        return this.dailyMapper.fromEntityToModel(updatedEntity);
    }

    public async deleteById(author: User, id: string): Promise<void> {
        const result = await this.getRepository().softDelete({ id });

        if (!result.affected) {
            throw new DailyNotFoundError();
        }
    }

    private getRepository(): Repository<DailyEntity> {
        return this.txHost.tx.getRepository(DailyEntity);
    }
}
