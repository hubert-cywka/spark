import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { DailyNotFoundError } from "@/modules/journal/daily/errors/DailyNotFound.error";
import { type IDailyMapper, DailyMapperToken } from "@/modules/journal/daily/mappers/IDaily.mapper";
import { Daily } from "@/modules/journal/daily/models/Daily.model";
import { IDailyService } from "@/modules/journal/daily/services/interfaces/IDaily.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";
import { type ISODateString } from "@/types/Date";

@Injectable()
export class DailyService implements IDailyService {
    private readonly logger = new Logger(DailyService.name);

    public constructor(
        @InjectRepository(DailyEntity, JOURNAL_MODULE_DATA_SOURCE)
        private readonly repository: Repository<DailyEntity>,
        @Inject(DailyMapperToken)
        private readonly dailyMapper: IDailyMapper
    ) {}

    public async findAllByDateRange(
        authorId: string,
        from: ISODateString,
        to: ISODateString,
        pageOptions: PageOptions
    ): Promise<Paginated<Daily>> {
        const queryBuilder = this.getRepository().createQueryBuilder("daily");

        queryBuilder
            .where("daily.date BETWEEN :from AND :to", { from, to })
            .andWhere("daily.authorId = :authorId", { authorId })
            .orderBy("daily.date", pageOptions.order)
            .skip(pageOptions.skip)
            .take(pageOptions.take);

        const [dailies, itemCount] = await queryBuilder.getManyAndCount();

        return {
            data: this.dailyMapper.fromEntityToModelBulk(dailies),
            meta: {
                itemCount,
                page: pageOptions.page,
                take: pageOptions.take,
            },
        };
    }

    public async findOneById(authorId: string, dailyId: string): Promise<Daily> {
        const daily = await this.getRepository().findOne({
            where: { id: dailyId, author: { id: authorId } },
        });

        if (!daily) {
            this.logger.warn({ authorId, dailyId }, "Daily not found.");
            throw new DailyNotFoundError();
        }

        return this.dailyMapper.fromEntityToModel(daily);
    }

    public async create(authorId: string, date: ISODateString): Promise<Daily> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(DailyEntity)
            .values({
                date,
                author: { id: authorId },
            })
            .returning("*")
            .execute();

        const insertedEntity = result.raw[0] as DailyEntity;
        return this.dailyMapper.fromEntityToModel(insertedEntity);
    }

    public async update(authorId: string, dailyId: string, date: ISODateString): Promise<Daily> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .update(DailyEntity)
            .set({ date })
            .where("id = :dailyId", { dailyId })
            .andWhere("author.id = :authorId", { authorId })
            .returning("*")
            .execute();

        const updatedEntity = result.raw[0];

        if (!updatedEntity) {
            this.logger.warn({ authorId, dailyId }, "Daily not found, cannot update.");
            throw new DailyNotFoundError();
        }

        return this.dailyMapper.fromEntityToModel(updatedEntity);
    }

    public async deleteById(authorId: string, dailyId: string): Promise<void> {
        const result = await this.getRepository().softDelete({
            id: dailyId,
            author: { id: authorId },
        });

        if (!result.affected) {
            this.logger.warn({ authorId, dailyId }, "Daily not found, cannot delete.");
            throw new DailyNotFoundError();
        }
    }

    public async restoreById(authorId: string, dailyId: string): Promise<void> {
        const result = await this.getRepository().restore({
            id: dailyId,
            author: { id: authorId },
        });

        if (!result.affected) {
            this.logger.warn({ authorId, dailyId }, "Daily not found, cannot restore.");
            throw new DailyNotFoundError();
        }
    }

    private getRepository(): Repository<DailyEntity> {
        return this.repository;
    }
}
