import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import dayjs from "dayjs";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { type IAlertPublisherService, AlertPublisherServiceToken } from "@/modules/alerts/services/interfaces/IAlertPublisher.service";
import { type IAlertSchedulerService, AlertSchedulerServiceToken } from "@/modules/alerts/services/interfaces/IAlertScheduler.service";
import { type IAlertsProcessorService } from "@/modules/alerts/services/interfaces/IAlertsProcessor.service";

@Injectable()
export class AlertsProcessorService implements IAlertsProcessorService {
    public constructor(
        @InjectRepository(AlertEntity, ALERTS_MODULE_DATA_SOURCE)
        private readonly repository: Repository<AlertEntity>,
        @Inject(AlertPublisherServiceToken)
        private readonly alertPublisher: IAlertPublisherService,
        @Inject(AlertSchedulerServiceToken)
        private readonly alertScheduler: IAlertSchedulerService
    ) {}

    @Cron("*/30 * * * * *")
    public async triggerPendingAlerts() {
        const now = dayjs().utc();

        const alertsToProcess = await this.repository
            .createQueryBuilder("alert")
            .leftJoinAndSelect("alert.recipient", "recipient")
            .where(":now >= alert.nextTriggerAt", { now })
            .andWhere("alert.nextTriggerAt IS NOT NULL")
            .andWhere("alert.enabled IS true")
            .getMany();

        for (const alert of alertsToProcess) {
            await this.triggerAlert(alert);
        }
    }

    @Transactional({ connectionName: ALERTS_MODULE_DATA_SOURCE })
    private async triggerAlert(alert: AlertEntity) {
        await this.alertPublisher.onReminderTriggered(alert.recipient.id);
        await this.repository.save({
            ...alert,
            nextTriggerAt: this.alertScheduler.scheduleNextTrigger(alert.time, alert.daysOfWeek),
        });
    }
}
