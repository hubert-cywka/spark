import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectTransactionHost, TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterTypeOrm } from "@nestjs-cls/transactional-adapter-typeorm";
import dayjs from "dayjs";

import { AlertEntity } from "@/modules/alerts/entities/Alert.entity";
import { ALERTS_MODULE_DATA_SOURCE } from "@/modules/alerts/infrastructure/database/constants";
import { type IAlertPublisherService, AlertPublisherServiceToken } from "@/modules/alerts/services/interfaces/IAlertPublisher.service";
import { type IAlertSchedulerService, AlertSchedulerServiceToken } from "@/modules/alerts/services/interfaces/IAlertScheduler.service";
import { type IAlertsProcessorService } from "@/modules/alerts/services/interfaces/IAlertsProcessor.service";

@Injectable()
export class AlertsProcessorService implements IAlertsProcessorService {
    public constructor(
        @InjectTransactionHost(ALERTS_MODULE_DATA_SOURCE)
        private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>,
        @Inject(AlertPublisherServiceToken)
        private readonly alertPublisher: IAlertPublisherService,
        @Inject(AlertSchedulerServiceToken)
        private readonly alertScheduler: IAlertSchedulerService
    ) {}

    @Cron("*/30 * * * * *")
    public async triggerPendingAlerts() {
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
                    nextTriggerAt: this.alertScheduler.findNextTriggerTime(alert.time, alert.daysOfWeek),
                });
            });
        }
    }

    private getRepository() {
        return this.txHost.tx.getRepository(AlertEntity);
    }
}
