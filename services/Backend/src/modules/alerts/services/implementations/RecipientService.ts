import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { RecipientEntity } from "@/modules/alerts/entities/Recipient.entity";
import { RecipientAlreadyExistsError } from "@/modules/alerts/errors/RecipientAlreadyExists.error";
import { RecipientNotFoundError } from "@/modules/alerts/errors/RecipientNotFound.error";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { type IRecipientMapper, RecipientMapperToken } from "@/modules/alerts/mappers/IRecipient.mapper";
import { type Recipient } from "@/modules/alerts/models/Recipient.model";
import { type IRecipientService } from "@/modules/alerts/services/interfaces/IRecipientService";

@Injectable()
export class RecipientService implements IRecipientService {
    private readonly logger = new Logger(RecipientService.name);

    public constructor(
        @InjectRepository(RecipientEntity, ALERTS_MODULE_DATA_SOURCE)
        private readonly repository: Repository<RecipientEntity>,
        @Inject(RecipientMapperToken)
        private readonly recipientMapper: IRecipientMapper
    ) {}

    @Transactional({ connectionName: ALERTS_MODULE_DATA_SOURCE })
    public async create(id: string): Promise<Recipient> {
        const repository = this.getRepository();
        const exists = await repository.exists({ where: { id } });

        if (exists) {
            throw new RecipientAlreadyExistsError();
        }

        const result = await repository.save({ id });
        return this.recipientMapper.fromEntityToModel(result);
    }

    @Transactional({ connectionName: ALERTS_MODULE_DATA_SOURCE })
    public async remove(id: string): Promise<void> {
        const repository = this.getRepository();
        const recipient = await repository.findOne({ where: { id } });

        if (!recipient) {
            this.logger.warn({ recipientId: id }, "Couldn't find recipient.");
            throw new RecipientNotFoundError();
        }

        await repository.remove([recipient]);
    }

    private getRepository(): Repository<RecipientEntity> {
        return this.repository;
    }
}
