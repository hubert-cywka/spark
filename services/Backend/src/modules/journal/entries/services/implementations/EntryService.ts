import { Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";

import { applyCursorBasedPagination, createPage, createPaginationKeys } from "@/common/pagination/pagination";
import { type PageOptions } from "@/common/pagination/types/PageOptions";
import { type Paginated } from "@/common/pagination/types/Paginated";
import { type IDailyProvider, DailyProviderToken } from "@/modules/journal/daily/services/interfaces/IDailyProvider";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { EntryDailyNotFoundError } from "@/modules/journal/entries/errors/EntryDailyNotFoundError";
import { EntryNotFoundError } from "@/modules/journal/entries/errors/EntryNotFound.error";
import { type IEntryMapper, EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { type Entry } from "@/modules/journal/entries/models/Entry.model";
import { type EntryFilters } from "@/modules/journal/entries/models/EntryFilters.model";
import { type IEntryService } from "@/modules/journal/entries/services/interfaces/IEntryService";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

export class EntryService implements IEntryService {
    private readonly logger = new Logger(EntryService.name);

    public constructor(
        @InjectRepository(EntryEntity, JOURNAL_MODULE_DATA_SOURCE)
        private readonly repository: Repository<EntryEntity>,
        @Inject(EntryMapperToken) private readonly entryMapper: IEntryMapper,
        @Inject(DailyProviderToken) private readonly dailyProvider: IDailyProvider
    ) {}

    public async findAll(authorId: string, pageOptions: PageOptions, filters: EntryFilters = {}): Promise<Paginated<Entry>> {
        const queryBuilder = this.getRepository().createQueryBuilder("entry").where("entry.authorId = :authorId", { authorId });

        const paginationKeys = createPaginationKeys(["createdAt", "id"]);
        applyCursorBasedPagination(queryBuilder, pageOptions, paginationKeys);

        this.applyDailyFilters(queryBuilder, filters);
        this.applyGoalFilters(queryBuilder, filters);
        this.applyScalarFilters(queryBuilder, filters);

        const entries = await queryBuilder.getMany();
        const page = createPage(entries, pageOptions.take, paginationKeys);
        return this.entryMapper.fromEntityToModelPaginated(page);
    }

    public async create(
        authorId: string,
        dailyId: string,
        { content, isCompleted, isFeatured }: Pick<Entry, "content" | "isFeatured" | "isCompleted">
    ): Promise<Entry> {
        await this.assertDailyExists(authorId, dailyId);

        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(EntryEntity)
            .values({
                content,
                isCompleted,
                isFeatured,
                daily: { id: dailyId },
                author: { id: authorId },
            })
            .returning("*")
            .execute();

        const insertedEntity = result.raw[0] as EntryEntity;
        return this.entryMapper.fromEntityToModel(insertedEntity);
    }

    public async deleteById(authorId: string, dailyId: string, entryId: string): Promise<void> {
        const result = await this.getRepository().softDelete({
            id: entryId,
            author: { id: authorId },
            daily: { id: dailyId },
        });

        if (!result.affected) {
            this.logger.warn({ authorId, dailyId, entryId }, "Entry not found, cannot delete.");
            throw new EntryNotFoundError();
        }
    }

    public async restoreById(authorId: string, dailyId: string, entryId: string): Promise<void> {
        const result = await this.getRepository().restore({
            id: entryId,
            author: { id: authorId },
            daily: { id: dailyId },
        });

        if (!result.affected) {
            this.logger.warn({ authorId, dailyId, entryId }, "Entry not found, cannot restore.");
            throw new EntryNotFoundError();
        }
    }

    public async update(
        authorId: string,
        dailyId: string,
        entryId: string,
        partialEntry: Pick<Entry, "isFeatured" | "isCompleted" | "content">
    ): Promise<Entry> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .update(EntryEntity)
            .set(partialEntry)
            .where("id = :entryId", { entryId })
            .andWhere("author.id = :authorId", { authorId })
            .andWhere("daily.id = :dailyId", { dailyId })
            .returning("*")
            .execute();

        const updatedEntity = result.raw[0];

        if (!updatedEntity) {
            this.logger.warn({ authorId, dailyId, entryId }, "Entry not found, cannot update.");
            throw new EntryNotFoundError();
        }

        return this.entryMapper.fromEntityToModel(updatedEntity);
    }

    private applyScalarFilters(
        qb: SelectQueryBuilder<EntryEntity>,
        { updatedBefore, updatedAfter, content, featured, completed }: Partial<EntryFilters>
    ) {
        if (updatedAfter) {
            qb.andWhere("entry.updatedAt >= :updatedAfter", { updatedAfter });
        }

        if (updatedBefore) {
            qb.andWhere("entry.updatedAt <= :updatedBefore", { updatedBefore });
        }

        if (content) {
            qb.andWhere("entry.content ILIKE '%' || :content || '%'", { content });
        }

        if (featured !== undefined) {
            qb.andWhere("entry.isFeatured = :featured", { featured });
        }

        if (completed !== undefined) {
            qb.andWhere("entry.isCompleted = :completed", { completed });
        }

        return qb;
    }

    private applyDailyFilters(qb: SelectQueryBuilder<EntryEntity>, { from, to, includeDaily }: Partial<EntryFilters>) {
        if (includeDaily) {
            qb.innerJoinAndSelect("entry.daily", "daily");
        } else if (from || to) {
            qb.innerJoin("entry.daily", "daily");
        }

        if (from) {
            qb.andWhere("daily.date >= :from", { from });
        }

        if (to) {
            qb.andWhere("daily.date <= :to", { to });
        }

        return qb;
    }

    private applyGoalFilters(qb: SelectQueryBuilder<EntryEntity>, { goals, includeGoals }: Partial<EntryFilters>) {
        if (includeGoals) {
            qb.leftJoinAndSelect("entry.goals", "goal");
        } else if (goals?.length) {
            qb.leftJoin("entry.goals", "goal");
        }

        if (goals?.length) {
            qb.andWhere("goal.id IN (:...goals)", { goals });
        }

        return qb;
    }

    private async assertDailyExists(authorId: string, dailyId: string): Promise<void> {
        const exists = await this.dailyProvider.existsById(authorId, dailyId);

        if (!exists) {
            throw new EntryDailyNotFoundError(dailyId);
        }
    }

    private getRepository(): Repository<EntryEntity> {
        return this.repository;
    }
}
