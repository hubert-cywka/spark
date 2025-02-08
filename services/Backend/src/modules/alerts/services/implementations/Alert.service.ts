import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { AlertNotFoundError } from "@/modules/alerts/errors/AlertNotFound.error";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { type IAlertMapper, AlertMapperToken } from "@/modules/alerts/mappers/IAlert.mapper";
import { type Alert } from "@/modules/alerts/models/Alert.model";
import { type IAlertService } from "@/modules/alerts/services/interfaces/IAlert.service";
import { type IAlertPublisherService, AlertPublisherServiceToken } from "@/modules/alerts/services/interfaces/IAlertPublisher.service";
import { UTCDay } from "@/modules/alerts/types/UTCDay";

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
    public async create(recipientId: string, time: string, daysOfWeek: UTCDay[]): Promise<Alert> {
        const result = await this.getRepository()
            .createQueryBuilder()
            .insert()
            .into(AlertEntity)
            .values({
                recipient: { id: recipientId },
                nextTriggerAt: this.findNextTriggerTime(time, daysOfWeek),
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
            nextTriggerAt: this.findNextTriggerTime(time, daysOfWeek),
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

    private findNextTriggerTime(time: string, daysOfWeek: UTCDay[]): Date | null {
        if (!daysOfWeek.length) {
            return null;
        }

        const now = dayjs().utc();
        let nextAlertTime = dayjs().utc();

        const [hour, minute, second] = time.split(":");
        nextAlertTime = nextAlertTime.set("hour", parseInt(hour)).set("minute", parseInt(minute)).set("second", parseInt(second));

        const currentDayOfWeek = now.day();
        const daysLeftInCurrentWeek = daysOfWeek.filter((day) => day >= currentDayOfWeek);

        if (!!daysLeftInCurrentWeek.length && nextAlertTime.isAfter(now)) {
            const daysOffset = Math.min(...daysLeftInCurrentWeek.map(Number)) - currentDayOfWeek;
            nextAlertTime = nextAlertTime.add(daysOffset, "days");
        } else {
            const daysOffset = 7 - (currentDayOfWeek - Math.min(...daysOfWeek.map(Number)));
            nextAlertTime = nextAlertTime.add(daysOffset, "days");
        }

        return nextAlertTime.toDate();
    }

    // TODO: Move to separate class
    @Cron("*/30 * * * * *")
    private async processAlerts() {
        const now = dayjs().utc();

        const alertsToProcess = await this.getRepository()
            .createQueryBuilder("alert")
            .leftJoinAndSelect("alert.recipient", "recipient")
            .where(":now >= alert.nextTriggerAt", { now })
            .andWhere("alert.nextTriggerAt IS NOT NULL")
            .andWhere("alert.enabled IS true")
            .getMany();

        for (const alert of alertsToProcess) {
            await this.txHost.withTransaction(async () => {
                await this.alertPublisher.onReminderAlertTriggered(alert.recipient.email);
                await this.getRepository().save({
                    ...alert,
                    nextTriggerAt: this.findNextTriggerTime(alert.time, alert.daysOfWeek),
                });
            });
        }
    }
}
