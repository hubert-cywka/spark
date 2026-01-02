import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { type IAlertEventsPublisher, AlertEventsPublisherToken } from "@/modules/alerts/services/interfaces/IAlertEventsPublisher";
import { type IAlertScheduler, AlertSchedulerToken } from "@/modules/alerts/services/interfaces/IAlertScheduler";
import { type IAlertsProcessor } from "@/modules/alerts/services/interfaces/IAlertsProcessor";

const BATCH_SIZE = 100;

@Injectable()
export class AlertsProcessor implements IAlertsProcessor {
    public constructor(
        @InjectRepository(AlertEntity, ALERTS_MODULE_DATA_SOURCE)
        private readonly repository: Repository<AlertEntity>,
        @Inject(AlertEventsPublisherToken)
        private readonly alertPublisher: IAlertEventsPublisher,
        @Inject(AlertSchedulerToken)
        private readonly alertScheduler: IAlertScheduler
    ) {}

    public async triggerPendingAlerts() {
        const now = dayjs().utc();

        let hasMoreAlerts = true;

        while (hasMoreAlerts) {
            const alertsToProcess = await this.repository
                .createQueryBuilder("alert")
                .leftJoinAndSelect("alert.recipient", "recipient")
                .where(":now >= alert.nextTriggerAt", { now })
                .andWhere("alert.nextTriggerAt IS NOT NULL")
                .andWhere("alert.enabled IS true")
                .orderBy("alert.nextTriggerAt", "ASC")
                .limit(BATCH_SIZE)
                .getMany();

            hasMoreAlerts = alertsToProcess.length === BATCH_SIZE;

            if (alertsToProcess.length === 0) {
                break;
            }

            await this.triggerAlerts(alertsToProcess);
        }
    }

    @Transactional({ connectionName: ALERTS_MODULE_DATA_SOURCE })
    private async triggerAlerts(alerts: AlertEntity[]) {
        const recipientIds = alerts.map((alert) => alert.recipient.id);
        await this.alertPublisher.onRemindersTriggered(recipientIds);

        const values = alerts.map((alert) => ({
            id: alert.id,
            nextTriggerAt: this.alertScheduler.scheduleNextTrigger(alert.time, alert.daysOfWeek),
        }));

        await this.repository.createQueryBuilder().insert().into(AlertEntity).values(values).orUpdate(["nextTriggerAt"], ["id"]).execute();
    }
}
