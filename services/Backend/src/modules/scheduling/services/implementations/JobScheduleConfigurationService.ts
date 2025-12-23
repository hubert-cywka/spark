import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { JobScheduleEntity } from "@/modules/scheduling/entities/JobScheduleEntity";
import { SCHEDULING_MODULE_DATA_SOURCE } from "@/modules/scheduling/infrastructure/database/constants";
import { JobCallback } from "@/modules/scheduling/models/JobCallback.model";
import { type IJobScheduleConfigurationService } from "@/modules/scheduling/services/interfaces/IJobScheduleConfigurationService";

@Injectable()
export class JobScheduleConfigurationService implements IJobScheduleConfigurationService {
    private readonly logger = new Logger(JobScheduleConfigurationService.name);

    public constructor(
        @InjectRepository(JobScheduleEntity, SCHEDULING_MODULE_DATA_SOURCE)
        private readonly repository: Repository<JobScheduleEntity>
    ) {}

    public async upsert(id: string, interval: number, callback: JobCallback): Promise<void> {
        const repository = this.getRepository();
        await repository.save({ id, interval, callbackTopic: callback.topic, callbackSubject: callback.subject });
        this.logger.log({ id, interval, callback }, "Job schedule configuration updated.");
    }

    private getRepository(): Repository<JobScheduleEntity> {
        return this.repository;
    }
}
