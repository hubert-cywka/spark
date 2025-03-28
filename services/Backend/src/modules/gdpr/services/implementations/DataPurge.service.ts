import { Inject, Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { InjectTransactionHost, Transactional, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";
import { IsNull, Repository } from "typeorm";

import { DataPurgePlanEntity } from "@/modules/gdpr/entities/DataPurgePlan.entity";
import { GDPR_MODULE_DATA_SOURCE } from "@/modules/gdpr/infrastructure/database/constants";
import { type IDataPurgeService } from "@/modules/gdpr/services/interfaces/IDataPurge.service";
import {
    type IDataPurgePublisherService,
    DataPurgePublisherServiceToken,
} from "@/modules/gdpr/services/interfaces/IDataPurgePublisher.service";

const PURGE_PROCESSING_INTERVAL = 1000 * 60 * 60;
const DATA_RETENTION_PERIOD = 1000 * 60 * 60 * 24 * 7;

@Injectable()
export class DataPurgeService implements IDataPurgeService {
    private readonly logger = new Logger(DataPurgeService.name);

    public constructor(
        @InjectTransactionHost(GDPR_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(DataPurgePublisherServiceToken)
        private readonly publisher: IDataPurgePublisherService
    ) {}

    @Transactional(GDPR_MODULE_DATA_SOURCE)
    public async scheduleForTenant(tenantId: string): Promise<void> {
        const repository = this.getRepository();
        const existingPlan = await repository.findOne({
            where: { tenantId, cancelledAt: IsNull(), processedAt: IsNull() },
        });

        if (existingPlan) {
            this.logger.warn({ tenantId, planId: existingPlan.id }, "Purge plan already exists.");
        } else {
            const newPlan = await repository.save({
                tenantId,
                scheduledAt: new Date(),
            });
            this.logger.log({ tenantId, planId: newPlan.id }, "Purge plan created.");
        }
    }

    @Transactional(GDPR_MODULE_DATA_SOURCE)
    public async cancelForTenant(tenantId: string): Promise<void> {
        const repository = this.getRepository();
        const result = await repository.update({ tenantId, cancelledAt: IsNull(), processedAt: IsNull() }, { cancelledAt: new Date() });

        if (!result.affected) {
            this.logger.warn({ tenantId }, "No purge plans that can be cancelled.");
        } else {
            this.logger.log({ tenantId }, "Purge plan cancelled.");
        }
    }

    private async processPlan(plan: DataPurgePlanEntity): Promise<void> {
        const now = dayjs();

        if (plan.cancelledAt) {
            this.logger.log({ planId: plan.id, cancelledAt: plan.cancelledAt }, "Purge plan was already cancelled.");
            return;
        }

        await this.txHost.withTransaction(async () => {
            const repository = this.getRepository();
            await repository.save({ ...plan, processedAt: now });

            await this.publisher.onPurgePlanProcessed(plan.tenantId, {
                account: { id: plan.tenantId },
            });
            this.logger.log({ planId: plan.id, scheduledAt: plan.scheduledAt }, "Purge plan processed.");
        });
    }

    @Interval(PURGE_PROCESSING_INTERVAL)
    @Transactional(GDPR_MODULE_DATA_SOURCE)
    private async processDataPurgePlans(): Promise<void> {
        const scheduledBefore = dayjs().subtract(DATA_RETENTION_PERIOD, "milliseconds");

        const plansToProcess = await this.getRepository()
            .createQueryBuilder("plan")
            .where(":scheduledBefore >= plan.scheduledAt", { scheduledBefore })
            .andWhere("plan.cancelledAt IS NULL")
            .andWhere("plan.processedAt IS NULL")
            .getMany();

        this.logger.log({ plansToProcess: plansToProcess.length }, "Processing purge plans.");

        for (const planToProcess of plansToProcess) {
            await this.processPlan(planToProcess);
        }
    }

    private getRepository(): Repository<DataPurgePlanEntity> {
        return this.txHost.tx.getRepository(DataPurgePlanEntity);
    }
}
