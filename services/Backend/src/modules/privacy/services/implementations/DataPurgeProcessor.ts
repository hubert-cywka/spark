import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DataPurgePlanEntity } from "@/modules/privacy/entities/DataPurgePlan.entity";
import { PRIVACY_MODULE_DATA_SOURCE } from "@/modules/privacy/infrastructure/database/constants";
import {
    type IDataPurgeEventsPublisher,
    DataPurgeEventsPublisherToken,
} from "@/modules/privacy/services/interfaces/IDataPurgeEventsPublisher";
import { IDataPurgeProcessor } from "@/modules/privacy/services/interfaces/IDataPurgeProcessor";

@Injectable()
export class DataPurgeProcessor implements IDataPurgeProcessor {
    private readonly logger = new Logger(DataPurgeProcessor.name);

    public constructor(
        @InjectRepository(DataPurgePlanEntity, PRIVACY_MODULE_DATA_SOURCE)
        private readonly repository: Repository<DataPurgePlanEntity>,
        @Inject(DataPurgeEventsPublisherToken)
        private readonly publisher: IDataPurgeEventsPublisher
    ) {}

    @Transactional({ connectionName: PRIVACY_MODULE_DATA_SOURCE })
    public async processDataPurgePlans(): Promise<void> {
        const now = dayjs();

        const plansToProcess = await this.getRepository()
            .createQueryBuilder("plan")
            .where(":now >= plan.removeAt", { now })
            .andWhere("plan.cancelledAt IS NULL")
            .andWhere("plan.processedAt IS NULL")
            .getMany();

        this.logger.log({ plansToProcess: plansToProcess.length }, "Processing purge plans.");

        for (const planToProcess of plansToProcess) {
            await this.processPlan(planToProcess);
        }
    }

    @Transactional({ connectionName: PRIVACY_MODULE_DATA_SOURCE })
    private async processPlan(plan: DataPurgePlanEntity): Promise<void> {
        const now = dayjs();

        if (plan.cancelledAt) {
            this.logger.log({ planId: plan.id, cancelledAt: plan.cancelledAt }, "Purge plan was already cancelled.");
            return;
        }

        const repository = this.getRepository();
        await repository.save({ ...plan, processedAt: now });

        await this.publisher.onPurgePlanProcessed(plan.tenantId, {
            account: { id: plan.tenantId },
        });
        this.logger.log({ planId: plan.id, scheduledAt: plan.scheduledAt }, "Purge plan processed.");
    }

    private getRepository(): Repository<DataPurgePlanEntity> {
        return this.repository;
    }
}
