import { Inject, Logger } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { PageMetaDto } from "@/common/pagination/dto/PageMeta.dto";
import { PageOptions } from "@/common/pagination/types/PageOptions";
import { Paginated } from "@/common/pagination/types/Paginated";
import { EntryEntity } from "@/modules/journal/entries/entities/Entry.entity";
import { EntryNotFoundError } from "@/modules/journal/entries/errors/EntryNotFound.error";
import { type IEntryMapper, EntryMapperToken } from "@/modules/journal/entries/mappers/IEntry.mapper";
import { Entry } from "@/modules/journal/entries/models/Entry.model";
import { type IEntryService } from "@/modules/journal/entries/services/interfaces/IEntry.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

export class EntryService implements IEntryService {
    private readonly logger = new Logger(EntryService.name);

    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(EntryMapperToken) private readonly entryMapper: IEntryMapper
    ) {}

    public async findAllByDateRange(authorId: string, from: string, to: string, pageOptions: PageOptions): Promise<Paginated<Entry>> {
        const queryBuilder = this.getRepository().createQueryBuilder("entry");

        queryBuilder
            .innerJoinAndSelect("entry.daily", "daily")
            .where("entry.authorId = :authorId", { authorId })
            .andWhere("daily.date BETWEEN :from AND :to", { from, to })
            .orderBy("daily.date", pageOptions.order)
            .addOrderBy("entry.createdAt", "ASC")
            .take(pageOptions.take)
            .skip(pageOptions.skip);

        const [entries, itemCount] = await queryBuilder.getManyAndCount();

        // TODO: Do not use DTOs here
        return {
            data: this.entryMapper.fromEntityToModelBulk(entries),
            meta: new PageMetaDto({
                itemCount,
                page: pageOptions.page,
                take: pageOptions.take,
            }),
        };
    }

    // TODO: Don't save Entry if Daily is soft-removed
    public async create(authorId: string, dailyId: string, content: string): Promise<Entry> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(EntryEntity)
            .values({
                content,
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

    public async updateContent(authorId: string, dailyId: string, entryId: string, content: string): Promise<Entry> {
        return await this.updateEntry(authorId, dailyId, entryId, { content });
    }

    public async updateStatus(authorId: string, dailyId: string, entryId: string, isCompleted: boolean): Promise<Entry> {
        return await this.updateEntry(authorId, dailyId, entryId, {
            isCompleted,
        });
    }

    private async updateEntry(authorId: string, dailyId: string, entryId: string, partialEntry: Partial<EntryEntity>): Promise<Entry> {
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

    private getRepository(): Repository<EntryEntity> {
        return this.txHost.tx.getRepository(EntryEntity);
    }
}
