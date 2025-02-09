import { Inject, Injectable } from "@nestjs/common";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { AlertNotFoundError } from "@/modules/alerts/errors/AlertNotFound.error";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { type IAlertMapper, AlertMapperToken } from "@/modules/alerts/mappers/IAlert.mapper";
import { type Alert } from "@/modules/alerts/models/Alert.model";
import { type IAlertService } from "@/modules/alerts/services/interfaces/IAlert.service";
import { type IAlertSchedulerService, AlertSchedulerServiceToken } from "@/modules/alerts/services/interfaces/IAlertScheduler.service";
import { type UTCDay } from "@/modules/alerts/types/UTCDay";

@Injectable()
export class AlertService implements IAlertService {
    public constructor(
        @InjectTransactionHost(ALERTS_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(AlertMapperToken) private readonly alertMapper: IAlertMapper,
        @Inject(AlertSchedulerServiceToken)
        private readonly alertScheduler: IAlertSchedulerService
    ) {}

    public async getAll(recipientId: string): Promise<Alert[]> {
        const result = await this.getRepository().find({
            where: { recipient: { id: recipientId } },
            order: { createdAt: "DESC" },
        });
        return this.alertMapper.fromEntityToModelBulk(result);
    }

    // TODO: Limit number of alerts per user
    public async create(recipientId: string, time: string, daysOfWeek: UTCDay[]): Promise<Alert> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(AlertEntity)
            .values({
                recipient: { id: recipientId },
                nextTriggerAt: this.alertScheduler.findNextTriggerTime(time, daysOfWeek),
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
            nextTriggerAt: this.alertScheduler.findNextTriggerTime(time, daysOfWeek),
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
            throw new AlertNotFoundError();
        }

        return this.alertMapper.fromEntityToModel(result.raw[0] as AlertEntity);
    }

    private getRepository() {
        return this.txHost.tx.getRepository(AlertEntity);
    }
}
