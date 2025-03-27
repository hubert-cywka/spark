import { Inject, Injectable } from "@nestjs/common";
import { InjectTransactionHost, Transactional, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { RecipientEntity } from "@/modules/alerts/entities/Recipient.entity";
import { RecipientAlreadyExistsError } from "@/modules/alerts/errors/RecipientAlreadyExists.error";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { type IRecipientMapper, RecipientMapperToken } from "@/modules/alerts/mappers/IRecipient.mapper";
import { type Recipient } from "@/modules/alerts/models/Recipient.model";
import { type IRecipientService } from "@/modules/alerts/services/interfaces/IRecipient.service";

@Injectable()
export class RecipientService implements IRecipientService {
    public constructor(
        @InjectTransactionHost(ALERTS_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(RecipientMapperToken)
        private readonly recipientMapper: IRecipientMapper
    ) {}

    @Transactional(ALERTS_MODULE_DATA_SOURCE)
    public async create(id: string, email: string): Promise<Recipient> {
        return await this.txHost.withTransaction(async () => {
            const repository = this.getRepository();
            const exists = await repository.exists({ where: { id } });

            if (exists) {
                throw new RecipientAlreadyExistsError();
            }

            const result = await repository.save({ id, email });
            return this.recipientMapper.fromEntityToModel(result);
        });
    }

    private getRepository(): Repository<RecipientEntity> {
        return this.txHost.tx.getRepository(RecipientEntity);
    }
}
