import { Inject, Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { AuthorAlreadyExistsError } from "@/modules/journal/authors/errors/AuthorAlreadyExists.error";
import { type IAuthorMapper, AuthorMapperToken } from "@/modules/journal/authors/mappers/IAuthor.mapper";
import { type Author } from "@/modules/journal/authors/models/Author.model";
import { type IAuthorService } from "@/modules/journal/authors/services/interfaces/IAuthor.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

@Injectable()
export class AuthorService implements IAuthorService {
    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(AuthorMapperToken) private readonly authorMapper: IAuthorMapper
    ) {}

    public async create(id: string): Promise<Author> {
        return await this.txHost.withTransaction(async () => {
            const repository = this.getRepository();
            const exists = await repository.exists({ where: { id } });

            if (exists) {
                throw new AuthorAlreadyExistsError();
            }

            const result = await repository.save({ id });
            return this.authorMapper.fromEntityToModel(result);
        });
    }

    public async remove(id: string): Promise<void> {
        const repository = this.getRepository();
        await repository.delete({ id });
    }

    private getRepository(): Repository<AuthorEntity> {
        return this.txHost.tx.getRepository(AuthorEntity);
    }
}
