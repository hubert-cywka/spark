import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { TenantEntity } from "@/modules/gdpr/entities/Tenant.entity";
import { TenantAlreadyExistsError } from "@/modules/gdpr/errors/TenantAlreadyExists.error";
import { TenantNotFoundError } from "@/modules/gdpr/errors/TenantNotFound.error";
import { GDPR_MODULE_DATA_SOURCE } from "@/modules/gdpr/infrastructure/database/constants";
import { type ITenantMapper, TenantMapperToken } from "@/modules/gdpr/mappers/ITenant.mapper";
import { type Tenant } from "@/modules/gdpr/models/Tenant.model";
import { type ITenantService } from "@/modules/gdpr/services/interfaces/ITenant.service";

@Injectable()
export class TenantService implements ITenantService {
    private readonly logger = new Logger(TenantService.name);

    public constructor(
        @InjectRepository(TenantEntity, GDPR_MODULE_DATA_SOURCE)
        private readonly repository: Repository<TenantEntity>,
        @Inject(TenantMapperToken)
        private readonly tenantMapper: ITenantMapper
    ) {}

    @Transactional({ connectionName: GDPR_MODULE_DATA_SOURCE })
    public async create(id: string): Promise<Tenant> {
        const repository = this.getRepository();
        const exists = await repository.exists({ where: { id } });

        if (exists) {
            throw new TenantAlreadyExistsError();
        }

        const result = await repository.save({ id });
        return this.tenantMapper.fromEntityToModel(result);
    }

    @Transactional({ connectionName: GDPR_MODULE_DATA_SOURCE })
    public async remove(id: string): Promise<void> {
        const repository = this.getRepository();
        const tenant = await repository.findOne({ where: { id } });

        if (!tenant) {
            this.logger.warn({ tenantId: id }, "Couldn't find tenant.");
            throw new TenantNotFoundError();
        }

        await repository.remove([tenant]);
    }

    private getRepository(): Repository<TenantEntity> {
        return this.repository;
    }
}
