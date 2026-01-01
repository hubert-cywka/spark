import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { applyCursorBasedPagination, createPage, createPaginationKeys } from "@/common/pagination/pagination";
import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { DailyEntity } from "@/modules/journal/daily/entities/Daily.entity";
import { DailyNotFoundError } from "@/modules/journal/daily/errors/DailyNotFound.error";
import { type IDailyMapper, DailyMapperToken } from "@/modules/journal/daily/mappers/IDaily.mapper";
import { Daily } from "@/modules/journal/daily/models/Daily.model";
import { type IDailyProvider } from "@/modules/journal/daily/services/interfaces/IDailyProvider";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";
import { type ISODateString } from "@/types/Date";

@Injectable()
export class DailyProvider implements IDailyProvider {
    private readonly logger = new Logger(DailyProvider.name);

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

        queryBuilder.where("daily.date BETWEEN :from AND :to", { from, to }).andWhere("daily.authorId = :authorId", { authorId });

        const paginationKeys = createPaginationKeys(["createdAt", "id"]);
        applyCursorBasedPagination(queryBuilder, pageOptions, paginationKeys);

        const dailies = await queryBuilder.getMany();
        const mappedDailies = this.dailyMapper.fromEntityToModelBulk(dailies);
        return createPage(mappedDailies, pageOptions.take, paginationKeys);
    }

    public async getById(authorId: string, dailyId: string): Promise<Daily> {
        const daily = await this.getRepository().findOne({
            where: { id: dailyId, author: { id: authorId } },
        });

        if (!daily) {
            this.logger.warn({ authorId, dailyId }, "Daily not found.");
            throw new DailyNotFoundError();
        }

        return this.dailyMapper.fromEntityToModel(daily);
    }

    public async existsById(authorId: string, dailyId: string): Promise<boolean> {
        const daily = await this.getRepository().findOne({
            where: { id: dailyId, author: { id: authorId } },
        });

        return !!daily;
    }

    private getRepository(): Repository<DailyEntity> {
        return this.repository;
    }
}
