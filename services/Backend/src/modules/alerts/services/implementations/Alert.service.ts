import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { AlertLimitReachedError } from "@/modules/alerts/errors/AlertLimitReached.error";
import { AlertNotFoundError } from "@/modules/alerts/errors/AlertNotFound.error";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { type IAlertMapper, AlertMapperToken } from "@/modules/alerts/mappers/IAlert.mapper";
import { type Alert } from "@/modules/alerts/models/Alert.model";
import { type IAlertService } from "@/modules/alerts/services/interfaces/IAlert.service";
import { type IAlertScheduler, AlertSchedulerServiceToken } from "@/modules/alerts/services/interfaces/IAlertScheduler.service";
import { type UTCDay } from "@/modules/alerts/types/UTCDay";

const MAX_NUMBER_OF_ALERTS_PER_RECIPIENT = 5;

@Injectable()
export class AlertService implements IAlertService {
    private readonly logger = new Logger(AlertService.name);

    public constructor(
        @InjectRepository(AlertEntity, ALERTS_MODULE_DATA_SOURCE)
        private readonly repository: Repository<AlertEntity>,
        @Inject(AlertMapperToken) private readonly alertMapper: IAlertMapper,
        @Inject(AlertSchedulerServiceToken)
        private readonly alertScheduler: IAlertScheduler
    ) {}

    public async getAll(recipientId: string): Promise<Alert[]> {
        const result = await this.getRepository().find({
            where: { recipient: { id: recipientId } },
            order: { createdAt: "DESC" },
        });
        return this.alertMapper.fromEntityToModelBulk(result);
    }

    @Transactional({ connectionName: ALERTS_MODULE_DATA_SOURCE })
    public async create(recipientId: string, time: string, daysOfWeek: UTCDay[]): Promise<Alert> {
        await this.assertEligibilityToCreate(recipientId);

        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(AlertEntity)
            .values({
                recipient: { id: recipientId },
                nextTriggerAt: this.alertScheduler.scheduleNextTrigger(time, daysOfWeek),
                daysOfWeek,
                time,
                enabled: true,
            })
            .returning("*")
            .execute();

        return this.alertMapper.fromEntityToModel(result.raw[0]);
    }

    public async delete(recipientId: string, alertId: string): Promise<void> {
        const result = await this.getRepository().softDelete({
            id: alertId,
            recipient: { id: recipientId },
        });

        if (!result.affected) {
            this.logger.warn({ recipientId, alertId }, "Alert not found, cannot delete.");
            throw new AlertNotFoundError();
        }
    }

    public async restore(recipientId: string, alertId: string): Promise<void> {
        const result = await this.getRepository().restore({
            id: alertId,
            recipient: { id: recipientId },
        });

        if (!result.affected) {
            this.logger.warn({ recipientId, alertId }, "Alert not found, cannot restore.");
            throw new AlertNotFoundError();
        }
    }

    public async changeStatus(recipientId: string, alertId: string, enabled: boolean): Promise<Alert> {
        return this.updatePartially(recipientId, alertId, {
            enabled,
            nextTriggerAt: null,
        });
    }

    public async changeTime(recipientId: string, alertId: string, time: string, daysOfWeek: UTCDay[]): Promise<Alert> {
        return this.updatePartially(recipientId, alertId, {
            time,
            daysOfWeek,
            nextTriggerAt: this.alertScheduler.scheduleNextTrigger(time, daysOfWeek),
        });
    }

    private async updatePartially(recipientId: string, alertId: string, partialAlert: Partial<AlertEntity>): Promise<Alert> {
        const queryBuilder = this.getRepository().createQueryBuilder("alert");

        const result = await queryBuilder
            .update(AlertEntity)
            .set(partialAlert)
            .where("alert.id = :alertId", { alertId })
            .andWhere("recipient.id = :recipientId", { recipientId })
            .returning("*")
            .execute();

        if (!result.affected) {
            this.logger.warn({ recipientId, alertId }, "Alert not found, cannot update.");
            throw new AlertNotFoundError();
        }

        return this.alertMapper.fromEntityToModel(result.raw[0] as AlertEntity);
    }

    private async assertEligibilityToCreate(recipientId: string): Promise<void> {
        const existingAlertsCount = await this.count(recipientId);

        if (existingAlertsCount >= MAX_NUMBER_OF_ALERTS_PER_RECIPIENT) {
            this.logger.log({ recipientId, existingAlertsCount }, "Maximum number of alerts reached.");
            throw new AlertLimitReachedError();
        }
    }

    private async count(recipientId: string): Promise<number> {
        return await this.getRepository().count({
            where: { recipient: { id: recipientId } },
        });
    }

    private getRepository() {
        return this.repository;
    }
}
