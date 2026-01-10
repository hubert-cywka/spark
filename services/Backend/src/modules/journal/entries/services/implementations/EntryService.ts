import { Inject, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository, SelectQueryBuilder } from "typeorm";

import { applyCursorBasedPagination, createPage, createPaginationKeys } from "@/common/pagination/pagination";
import { type PageOptions } from "@/common/pagination/types/PageOptions";
import { type Paginated } from "@/common/pagination/types/Paginated";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
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
        @Inject(EntryMapperToken) private readonly entryMapper: IEntryMapper
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
        { date, content, isCompleted, isFeatured }: Pick<Entry, "date" | "content" | "isFeatured" | "isCompleted">
    ): Promise<Entry> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(EntryEntity)
            .values({
                date,
                content,
                isCompleted,
                isFeatured,
                author: { id: authorId },
            })
            .returning("*")
            .execute();

        const insertedEntity = result.raw[0] as EntryEntity;
        return this.entryMapper.fromEntityToModel(insertedEntity);
    }

    public async deleteById(authorId: string, entryId: string): Promise<void> {
        const result = await this.getRepository().softDelete({
            id: entryId,
            author: { id: authorId },
        });

        if (!result.affected) {
            this.logger.warn({ authorId, entryId }, "Entry not found, cannot delete.");
            throw new EntryNotFoundError();
        }
    }

    public async bulkDelete(authorId: string, entriesIds: string[]): Promise<void> {
        await this.getRepository().softDelete({
            id: In(entriesIds),
            author: { id: authorId },
        });
    }

    public async restoreById(authorId: string, entryId: string): Promise<void> {
        const result = await this.getRepository().restore({
            id: entryId,
            author: { id: authorId },
        });

        if (!result.affected) {
            this.logger.warn({ authorId, entryId }, "Entry not found, cannot restore.");
            throw new EntryNotFoundError();
        }
    }

    public async update(
        authorId: string,
        entryId: string,
        partialEntry: Pick<Entry, "isFeatured" | "isCompleted" | "content" | "date">
    ): Promise<Entry> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .update(EntryEntity)
            .set(partialEntry)
            .where("id = :entryId", { entryId })
            .andWhere("author.id = :authorId", { authorId })
            .returning("*")
            .execute();

        const updatedEntity = result.raw[0];

        if (!updatedEntity) {
            this.logger.warn({ authorId, entryId }, "Entry not found, cannot update.");
            throw new EntryNotFoundError();
        }

        return this.entryMapper.fromEntityToModel(updatedEntity);
    }

    public async bulkUpdate(
        authorId: string,
        entriesIds: string[],
        value: Pick<Entry, "isFeatured" | "isCompleted" | "content" | "date">
    ): Promise<Entry[]> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .update(EntryEntity)
            .set(value)
            .where("id IN (:...ids)", { ids: entriesIds })
            .andWhere("author.id = :authorId", { authorId })
            .returning("*")
            .execute();

        const updatedEntities = result.raw;
        return this.entryMapper.fromEntityToModelBulk(updatedEntities);
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

    private applyDailyFilters(qb: SelectQueryBuilder<EntryEntity>, { from, to }: Partial<EntryFilters>) {
        if (from) {
            qb.andWhere("entry.date >= :from", { from });
        }

        if (to) {
            qb.andWhere("entry.date <= :to", { to });
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

    private getRepository(): Repository<EntryEntity> {
        return this.repository;
    }
}
