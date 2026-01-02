import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { TenantEntity } from "@/modules/configuration/entities/Tenant.entity";
import { TenantAlreadyExistsError } from "@/modules/configuration/errors/TenantAlreadyExists.error";
import { TenantNotFoundError } from "@/modules/configuration/errors/TenantNotFound.error";
import { CONFIGURATION_MODULE_DATA_SOURCE } from "@/modules/configuration/infrastructure/database/constants";
import { type ITenantMapper, TenantMapperToken } from "@/modules/configuration/mappers/ITenant.mapper";
import { type Tenant } from "@/modules/configuration/models/Tenant.model";
import { type ITenantService } from "@/modules/configuration/services/interfaces/ITenantService";

@Injectable()
export class TenantService implements ITenantService {
    private readonly logger = new Logger(TenantService.name);

    public constructor(
        @InjectRepository(TenantEntity, CONFIGURATION_MODULE_DATA_SOURCE)
        private readonly repository: Repository<TenantEntity>,
        @Inject(TenantMapperToken)
        private readonly tenantMapper: ITenantMapper
    ) {}

    @Transactional({ connectionName: CONFIGURATION_MODULE_DATA_SOURCE })
    public async create(id: string): Promise<Tenant> {
        const repository = this.getRepository();
        const exists = await repository.exists({ where: { id } });

        if (exists) {
            throw new TenantAlreadyExistsError();
        }

        const result = await this.getRepository().createQueryBuilder().insert().into(TenantEntity).values({ id }).returning("*").execute();

        const tenant = result.raw[0] as TenantEntity;
        return this.tenantMapper.fromEntityToModel(tenant);
    }

    @Transactional({ connectionName: CONFIGURATION_MODULE_DATA_SOURCE })
    public async remove(id: string): Promise<void> {
        const repository = this.getRepository();
        const tenant = await repository.findOne({ where: { id } });

        if (!tenant) {
            this.logger.warn({ tenantId: id }, "Couldn't find tenant.");
            throw new TenantNotFoundError();
        }

        await repository.delete({ id: tenant.id });
    }

    private getRepository(): Repository<TenantEntity> {
        return this.repository;
    }
}
