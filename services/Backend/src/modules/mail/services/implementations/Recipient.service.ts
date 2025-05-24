import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { RecipientEntity } from "@/modules/mail/entities/Recipient.entity";
import { RecipientAlreadyExistsError } from "@/modules/mail/errors/RecipientAlreadyExists.error";
import { RecipientNotFoundError } from "@/modules/mail/errors/RecipientNotFound.error";
import { MAIL_MODULE_DATA_SOURCE } from "@/modules/mail/infrastructure/database/constants";
import { type IRecipientMapper, RecipientMapperToken } from "@/modules/mail/mappers/IRecipient.mapper";
import { type Recipient } from "@/modules/mail/models/Recipient.model";
import { type IRecipientService } from "@/modules/mail/services/interfaces/IRecipient.service";

@Injectable()
export class RecipientService implements IRecipientService {
    private readonly logger = new Logger(RecipientService.name);

    public constructor(
        @InjectRepository(RecipientEntity, MAIL_MODULE_DATA_SOURCE)
        private readonly repository: Repository<RecipientEntity>,
        @Inject(RecipientMapperToken)
        private readonly recipientMapper: IRecipientMapper
    ) {}

    @Transactional({ connectionName: MAIL_MODULE_DATA_SOURCE })
    public async create(id: string, email: string): Promise<Recipient> {
        const repository = this.getRepository();
        const exists = await repository.exists({ where: { id } });

        if (exists) {
            throw new RecipientAlreadyExistsError();
        }

        const result = await repository.save({ id, email });
        return this.recipientMapper.fromEntityToModel(result);
    }

    public async find(id: string): Promise<Recipient> {
        const repository = this.getRepository();
        const recipient = await repository.findOne({ where: { id } });

        if (!recipient) {
            this.logger.warn({ recipientId: id }, "Couldn't find recipient.");
            throw new RecipientNotFoundError();
        }

        return this.recipientMapper.fromEntityToModel(recipient);
    }

    @Transactional({ connectionName: MAIL_MODULE_DATA_SOURCE })
    public async remove(id: string): Promise<void> {
        const recipient = await this.find(id);
        await this.getRepository().remove([recipient]);
    }

    private getRepository(): Repository<RecipientEntity> {
        return this.repository;
    }
}
