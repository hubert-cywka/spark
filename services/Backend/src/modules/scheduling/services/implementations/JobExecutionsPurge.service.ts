import { Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { fromHours } from "@/common/utils/timeUtils";
import { JobExecutionEntity } from "@/modules/scheduling/entities/JobExecution.entity";
import { SCHEDULING_MODULE_DATA_SOURCE } from "@/modules/scheduling/infrastructure/database/constants";
import { type IJobExecutionsPurgeService } from "@/modules/scheduling/services/interfaces/IJobExecutionsPurge.service";

@Injectable()
export class JobExecutionsPurgeService implements IJobExecutionsPurgeService {
    private readonly logger = new Logger(JobExecutionsPurgeService.name);

    public constructor(
        @InjectRepository(JobExecutionEntity, SCHEDULING_MODULE_DATA_SOURCE)
        private readonly executionRepository: Repository<JobExecutionEntity>
    ) {}

    public async purgeAllButNLatest(latestJobsToKeep: number): Promise<void> {
        const subQuery = this.getExecutionRepository()
            .createQueryBuilder("execution")
            .select("execution.id")
            .where(
                `execution.id IN (
                SELECT "id" FROM (
                    SELECT 
                        "id",
                        ROW_NUMBER() OVER (
                            PARTITION BY "jobId"
                            ORDER BY "executedAt" DESC
                        ) as rn
                    FROM job_execution
                ) AS ranked_executions
                WHERE rn > :latestJobsToKeep
            )`
            )
            .setParameter("latestJobsToKeep", latestJobsToKeep)
            .getQuery();

        const deleteResult = await this.getExecutionRepository()
            .createQueryBuilder()
            .delete()
            .where(`id IN (${subQuery})`)
            .setParameter("latestJobsToKeep", latestJobsToKeep)
            .execute();

        this.logger.log(`Deleted ${deleteResult.affected} old job executions.`);
    }

    @Interval(fromHours(12))
    private async purge() {
        const executionsToKeep = 3;
        await this.purgeAllButNLatest(executionsToKeep);
    }

    private getExecutionRepository(): Repository<JobExecutionEntity> {
        return this.executionRepository;
    }
}
