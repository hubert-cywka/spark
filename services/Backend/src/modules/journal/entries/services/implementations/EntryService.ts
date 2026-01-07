import { Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { applyCursorBasedPagination, createPage, createPaginationKeys } from "@/common/pagination/pagination";
import { type PageOptions } from "@/common/pagination/types/PageOptions";
import { type Paginated } from "@/common/pagination/types/Paginated";
import { type IDailyProvider, DailyProviderToken } from "@/modules/journal/daily/services/interfaces/IDailyProvider";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { EntryDailyNotFoundError } from "@/modules/journal/entries/errors/EntryDailyNotFoundError";
import { EntryNotFoundError } from "@/modules/journal/entries/errors/EntryNotFound.error";
import { type IEntryMapper, EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { type IEntryDetailMapper, EntryDetailMapperToken } from "@/modules/journal/entries/mappers/IEntryDetail.mapper";
import { type Entry } from "@/modules/journal/entries/models/Entry.model";
import { EntryDetail } from "@/modules/journal/entries/models/EntryDetail.model";
import { type EntryFilters } from "@/modules/journal/entries/models/EntryFilters.model";
import { type IEntryService } from "@/modules/journal/entries/services/interfaces/IEntryService";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

export class EntryService implements IEntryService {
    private readonly logger = new Logger(EntryService.name);

    public constructor(
        @InjectRepository(EntryEntity, JOURNAL_MODULE_DATA_SOURCE)
        private readonly repository: Repository<EntryEntity>,
        @Inject(EntryMapperToken) private readonly entryMapper: IEntryMapper,
        @Inject(EntryDetailMapperToken) private readonly entryDetailMapper: IEntryDetailMapper,
        @Inject(DailyProviderToken) private readonly dailyProvider: IDailyProvider
    ) {}

    public async findAll(
        authorId: string,
        pageOptions: PageOptions,
        { from, to, content, completed, featured, goals, updatedBefore, updatedAfter }: EntryFilters = {}
    ): Promise<Paginated<Entry>> {
        const queryBuilder = this.getRepository().createQueryBuilder("entry").where("entry.authorId = :authorId", { authorId });

        const paginationKeys = createPaginationKeys(["createdAt", "id"]);
        applyCursorBasedPagination(queryBuilder, pageOptions, paginationKeys);

        if (from || to) {
            queryBuilder.innerJoin("entry.daily", "daily");

            if (from) {
                queryBuilder.andWhere("daily.date >= :from", { from });
            }

            if (to) {
                queryBuilder.andWhere("daily.date <= :to", { to });
            }
        }

        if (goals) {
            queryBuilder.leftJoin("entry.goals", "goal").andWhere("goal.id IN (:...goals)", { goals });
        }

        if (updatedAfter) {
            queryBuilder.andWhere("entry.updatedAt >= :updatedAfter", { updatedAfter });
        }

        if (updatedBefore) {
            queryBuilder.andWhere("entry.updatedAt <= :updatedBefore", { updatedBefore });
        }

        if (featured !== undefined) {
            queryBuilder.andWhere("entry.isFeatured = :featured", { featured });
        }

        if (completed !== undefined) {
            queryBuilder.andWhere("entry.isCompleted = :completed", { completed });
        }

        if (content) {
            queryBuilder.andWhere("entry.content ILIKE '%' || :content || '%'", { content });
        }

        const entries = await queryBuilder.getMany();
        const mappedEntries = this.entryMapper.fromEntityToModelBulk(entries);
        return createPage(mappedEntries, pageOptions.take, paginationKeys);
    }

    public async findAllDetailed(
        authorId: string,
        pageOptions: PageOptions,
        { from, to, content, completed, featured, goals, updatedBefore, updatedAfter }: EntryFilters = {}
    ): Promise<Paginated<EntryDetail>> {
        const queryBuilder = this.getRepository().createQueryBuilder("entry").where("entry.authorId = :authorId", { authorId });

        const paginationKeys = createPaginationKeys(["createdAt", "id"]);
        applyCursorBasedPagination(queryBuilder, pageOptions, paginationKeys)
            .innerJoinAndSelect("entry.daily", "daily")
            .leftJoinAndSelect("entry.goals", "goal");

        if (from) {
            queryBuilder.andWhere("daily.date >= :from", { from });
        }

        if (to) {
            queryBuilder.andWhere("daily.date <= :to", { to });
        }

        if (goals) {
            queryBuilder.andWhere("goal.id IN (:...goals)", { goals });
        }

        if (updatedAfter) {
            queryBuilder.andWhere("entry.updatedAt >= :updatedAfter", { updatedAfter });
        }

        if (updatedBefore) {
            queryBuilder.andWhere("entry.updatedAt <= :updatedBefore", { updatedBefore });
        }

        if (featured !== undefined) {
            queryBuilder.andWhere("entry.isFeatured = :featured", { featured });
        }

        if (completed !== undefined) {
            queryBuilder.andWhere("entry.isCompleted = :completed", { completed });
        }

        if (content) {
            queryBuilder.andWhere("entry.content ILIKE '%' || :content || '%'", { content });
        }

        const entries = await queryBuilder.getMany();
        const mappedEntries = this.entryDetailMapper.fromEntityToModelBulk(entries);
        return createPage(mappedEntries, pageOptions.take, paginationKeys);
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
