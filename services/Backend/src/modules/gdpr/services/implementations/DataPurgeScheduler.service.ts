import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { IsNull, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DataPurgePlanEntity } from "@/modules/gdpr/entities/DataPurgePlan.entity";
import { GDPR_MODULE_DATA_SOURCE } from "@/modules/gdpr/infrastructure/database/constants";
import { type IDataPurgePublisher, DataPurgePublisherServiceToken } from "@/modules/gdpr/services/interfaces/IDataPurgePublisher.service";
import { type IDataPurgeScheduler } from "@/modules/gdpr/services/interfaces/IDataPurgeScheduler.service";

const DATA_RETENTION_PERIOD_IN_DAYS = 7;

@Injectable()
export class DataPurgeScheduler implements IDataPurgeScheduler {
    private readonly logger = new Logger(DataPurgeScheduler.name);

    public constructor(
        @InjectRepository(DataPurgePlanEntity, GDPR_MODULE_DATA_SOURCE)
        private readonly repository: Repository<DataPurgePlanEntity>,
        @Inject(DataPurgePublisherServiceToken)
        private readonly publisher: IDataPurgePublisher
    ) {}

    @Transactional({ connectionName: GDPR_MODULE_DATA_SOURCE })
    public async scheduleForTenant(tenantId: string): Promise<void> {
        const repository = this.getRepository();
        const existingPlan = await repository.findOne({
            where: { tenantId, cancelledAt: IsNull(), processedAt: IsNull() },
        });

        if (existingPlan) {
            this.logger.warn({ tenantId, planId: existingPlan.id }, "Purge plan already exists.");
            return;
        }

        const removeAt = dayjs().add(DATA_RETENTION_PERIOD_IN_DAYS, "days").toDate();
        const newPlan = await repository.save({
            tenantId,
            scheduledAt: new Date(),
            removeAt,
        });

        await this.publisher.onPurgePlanScheduled(newPlan.tenantId, {
            account: { id: newPlan.tenantId },
            toBeRemovedAt: removeAt.toISOString(),
        });

        this.logger.log({ tenantId, planId: newPlan.id }, "Purge plan created.");
    }

    @Transactional({ connectionName: GDPR_MODULE_DATA_SOURCE })
    public async cancelForTenant(tenantId: string): Promise<void> {
        const repository = this.getRepository();
        const result = await repository.update({ tenantId, cancelledAt: IsNull(), processedAt: IsNull() }, { cancelledAt: new Date() });

        if (!result.affected) {
            this.logger.warn({ tenantId }, "No purge plans that can be cancelled.");
        } else {
            this.logger.log({ tenantId }, "Purge plan cancelled.");
        }
    }

    private getRepository(): Repository<DataPurgePlanEntity> {
        return this.repository;
    }
}
