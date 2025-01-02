import { Injectable } from "@nestjs/common";
import { InjectTransactionHost, Transactional, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { AuthorEntity } from "@/modules/journal/author/entities/Author.entity";
import { AuthorAlreadyExistsError } from "@/modules/journal/author/errors/AuthorAlreadyExists.error";
import { type Author } from "@/modules/journal/author/models/Author.model";
import { type IAuthorService } from "@/modules/journal/author/services/interfaces/IAuthor.service";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

@Injectable()
export class AuthorService implements IAuthorService {
    public constructor(
        @InjectTransactionHost(JOURNAL_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>
    ) {}

    @Transactional(JOURNAL_MODULE_DATA_SOURCE)
    public async create(id: string): Promise<Author> {
        const repository = this.getRepository();
        const exists = await repository.exists({ where: { id } });

        if (exists) {
            throw new AuthorAlreadyExistsError();
        }

        return await repository.save({ id });
    }

    private getRepository(): Repository<AuthorEntity> {
        return this.txHost.tx.getRepository(AuthorEntity);
    }
}
