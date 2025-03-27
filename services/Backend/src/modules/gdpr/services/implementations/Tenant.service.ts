import { Inject, Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import { Repository } from "typeorm";

import { TenantEntity } from "@/modules/gdpr/entities/Tenant.entity";
import { TenantAlreadyExistsError } from "@/modules/gdpr/errors/TenantAlreadyExists.error";
import { GDPR_MODULE_DATA_SOURCE } from "@/modules/gdpr/infrastructure/database/constants";
import { type ITenantMapper, TenantMapperToken } from "@/modules/gdpr/mappers/ITenant.mapper";
import { type Tenant } from "@/modules/gdpr/models/Tenant.model";
import { type ITenantService } from "@/modules/gdpr/services/interfaces/ITenant.service";

@Injectable()
export class TenantService implements ITenantService {
    public constructor(
        @InjectTransactionHost(GDPR_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(TenantMapperToken)
        private readonly tenantMapper: ITenantMapper
    ) {}

    public async create(id: string): Promise<Tenant> {
        return await this.txHost.withTransaction(async () => {
            const repository = this.getRepository();
            const exists = await repository.exists({ where: { id } });

            if (exists) {
                throw new TenantAlreadyExistsError();
            }

            const result = await repository.save({ id });
            return this.tenantMapper.fromEntityToModel(result);
        });
    }

    public async remove(id: string): Promise<void> {
        const repository = this.getRepository();
        await repository.delete({ id });
    }

    private getRepository(): Repository<TenantEntity> {
        return this.txHost.tx.getRepository(TenantEntity);
    }
}
