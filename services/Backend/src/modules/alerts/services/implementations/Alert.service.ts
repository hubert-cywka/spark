import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { Weekday } from "@/modules/alerts/enums/Weekday.enum";
import { AlertNotFoundError } from "@/modules/alerts/errors/AlertNotFound.error";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { type IAlertMapper, AlertMapperToken } from "@/modules/alerts/mappers/IAlert.mapper";
import { type Alert } from "@/modules/alerts/models/Alert.model";
import { type IAlertService } from "@/modules/alerts/services/interfaces/IAlert.service";
import { type IAlertPublisherService, AlertPublisherServiceToken } from "@/modules/alerts/services/interfaces/IAlertPublisher.service";

@Injectable()
export class AlertService implements IAlertService {
    public constructor(
        @InjectTransactionHost(ALERTS_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(AlertMapperToken) private readonly alertMapper: IAlertMapper,
        @Inject(AlertPublisherServiceToken)
        private readonly alertPublisher: IAlertPublisherService
    ) {}

    public async getAll(recipientId: string): Promise<Alert[]> {
        const result = await this.getRepository().find({
            where: { recipient: { id: recipientId } },
        });
        return this.alertMapper.fromEntityToModelBulk(result);
    }

    // TODO: Limit number of alerts per user
    public async create(recipientId: string, time: string, daysOfWeek: Weekday[]): Promise<Alert> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(AlertEntity)
            .values({
                recipient: { id: recipientId },
                daysOfWeek,
                time,
                enabled: true,
                lastTriggeredAt: dayjs().subtract(1, "day").endOf("day").toDate(),
            })
            .returning("*")
            .execute();

        return this.alertMapper.fromEntityToModel(result.raw[0]);
    }

    public async changeStatus(recipientId: string, alertId: string, enabled: boolean): Promise<Alert> {
        return this.updatePartially(recipientId, alertId, { enabled });
    }

    public async changeTime(recipientId: string, alertId: string, time: string): Promise<Alert> {
        return this.updatePartially(recipientId, alertId, { time });
    }

    public async changeDaysOfWeek(recipientId: string, alertId: string, daysOfWeek: Weekday[]): Promise<Alert> {
        return this.updatePartially(recipientId, alertId, { daysOfWeek });
    }

    private async updatePartially(recipientId: string, alertId: string, partialAlert: Partial<AlertEntity>): Promise<Alert> {
        const result = await this.getRepository().update({ recipient: { id: recipientId }, id: alertId }, partialAlert);

        if (!result.affected) {
            throw new AlertNotFoundError();
        }

        return this.alertMapper.fromEntityToModel(result.raw[0] as AlertEntity);
    }

    private getRepository() {
        return this.txHost.tx.getRepository(AlertEntity);
    }

    // TODO: Move to separate class
    @Cron("*/30 * * * * *")
    private async processAlerts() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const isoTime = now.toISOString().split("T")[1].split("Z")[0];

        const alertsToProcess = await this.getRepository()
            .createQueryBuilder("alert")
            .leftJoinAndSelect("alert.recipient", "recipient")
            .where(":day = ANY(alert.daysOfWeek)", { day: now.getDay() })
            .andWhere("alert.time <= :isoTime", { isoTime })
            .andWhere("alert.lastTriggeredAt IS NULL OR alert.lastTriggeredAt < :startOfDay", { startOfDay })
            .getMany();

        for (const alert of alertsToProcess) {
            await this.txHost.withTransaction(async () => {
                await this.alertPublisher.onReminderAlertTriggered(alert.recipient.email);
                await this.getRepository().save({
                    ...alert,
                    lastTriggeredAt: new Date(),
                });
            });
        }
    }
}
