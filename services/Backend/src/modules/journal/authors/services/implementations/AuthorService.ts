import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { AuthorEntity } from "@/modules/journal/authors/entities/Author.entity";
import { AuthorAlreadyExistsError } from "@/modules/journal/authors/errors/AuthorAlreadyExists.error";
import { AuthorNotFoundError } from "@/modules/journal/authors/errors/AuthorNotFound.error";
import { type IAuthorMapper, AuthorMapperToken } from "@/modules/journal/authors/mappers/IAuthor.mapper";
import { type Author } from "@/modules/journal/authors/models/Author.model";
import { type IAuthorService } from "@/modules/journal/authors/services/interfaces/IAuthorService";
import { JOURNAL_MODULE_DATA_SOURCE } from "@/modules/journal/infrastructure/database/constants";

@Injectable()
export class AuthorService implements IAuthorService {
    private readonly logger = new Logger(AuthorService.name);

    public constructor(
        @InjectRepository(AuthorEntity, JOURNAL_MODULE_DATA_SOURCE)
        private readonly repository: Repository<AuthorEntity>,
        @Inject(AuthorMapperToken) private readonly authorMapper: IAuthorMapper
    ) {}

    @Transactional({ connectionName: JOURNAL_MODULE_DATA_SOURCE })
    public async create(id: string): Promise<Author> {
        const repository = this.getRepository();
        const exists = await repository.exists({ where: { id } });

        if (exists) {
            throw new AuthorAlreadyExistsError();
        }

        const result = await this.getRepository().createQueryBuilder().insert().into(AuthorEntity).values({ id }).returning("*").execute();

        const author = result.raw[0] as AuthorEntity;
        return this.authorMapper.fromEntityToModel(author);
    }

    @Transactional({ connectionName: JOURNAL_MODULE_DATA_SOURCE })
    public async remove(id: string): Promise<void> {
        const repository = this.getRepository();
        const author = await repository.findOne({ where: { id } });

        if (!author) {
            this.logger.warn({ authorId: id }, "Couldn't find author.");
            throw new AuthorNotFoundError();
        }

        await repository.delete({ id: author.id });
    }

    private getRepository(): Repository<AuthorEntity> {
        return this.repository;
    }
}
