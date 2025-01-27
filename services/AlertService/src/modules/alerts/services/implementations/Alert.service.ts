import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { Weekday } from "@/modules/alerts/enums/Weekday.enum";
import { AlertNotFoundError } from "@/modules/alerts/errors/AlertNotFound.error";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { type IAlertMapper, AlertMapperToken } from "@/modules/alerts/mappers/IAlert.mapper";
import { type Alert } from "@/modules/alerts/models/Alert.model";
import { type IAlertService } from "@/modules/alerts/services/interfaces/IAlert.service";
import { type IAlertPublisherService, AlertPublisherServiceToken } from "@/modules/alerts/services/interfaces/IAlertPublisher.service";

dayjs.extend(utc);

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
            order: { createdAt: "DESC" },
        });
        return this.alertMapper.fromEntityToModelBulk(result);
    }

    // TODO: Limit number of alerts per user
    public async create(recipientId: string, time: string, daysOfWeek: Weekday[]): Promise<Alert> {
        const now = dayjs().utc();
        const isoTime = `${String(now.get("hours")).padStart(2, "0")}:${String(now.get("minutes")).padStart(2, "0")}:${String(now.get("seconds")).padStart(2, "0")}`;
        const lastTriggeredAt = time <= isoTime ? new Date() : null;

        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(AlertEntity)
            .values({
                recipient: { id: recipientId },
                daysOfWeek,
                time,
                enabled: true,
                lastTriggeredAt,
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
        return this.updatePartially(recipientId, alertId, { enabled });
    }

    public async changeTime(recipientId: string, alertId: string, time: string, daysOfWeek: Weekday[]): Promise<Alert> {
        const now = dayjs().utc();
        const isoTime = `${String(now.get("hours")).padStart(2, "0")}:${String(now.get("minutes")).padStart(2, "0")}:${String(now.get("seconds")).padStart(2, "0")}`;
        const lastTriggeredAt = time <= isoTime ? new Date() : null;

        return this.updatePartially(recipientId, alertId, {
            time,
            daysOfWeek,
            lastTriggeredAt,
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

    // TODO: Move to separate class
    @Cron("*/30 * * * * *")
    private async processAlerts() {
        const now = dayjs().utc();
        const startOfDay = dayjs().startOf("day").toISOString();
        const isoTime = `${String(now.get("hours")).padStart(2, "0")}:${String(now.get("minutes")).padStart(2, "0")}:${String(now.get("seconds")).padStart(2, "0")}`;
        const day = now.get("day");

        const alertsToProcess = await this.getRepository()
            .createQueryBuilder("alert")
            .leftJoinAndSelect("alert.recipient", "recipient")
            .where(":day = ANY(alert.daysOfWeek)", { day })
            .andWhere("alert.time <= :isoTime", { isoTime })
            .andWhere("alert.lastTriggeredAt IS NULL OR alert.lastTriggeredAt < :startOfDay", {
                startOfDay,
            })
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
