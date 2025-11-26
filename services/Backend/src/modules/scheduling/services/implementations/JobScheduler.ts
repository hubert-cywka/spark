import {Inject, Injectable, Logger} from "@nestjs/common";
import {Interval} from "@nestjs/schedule";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Transactional} from "typeorm-transactional";

import {type IEventPublisher,EventPublisherToken} from "@/common/events";
import {JobTriggeredEvent} from "@/common/events/types/scheduling/JobTriggeredEvent";
import {fromSeconds} from "@/common/utils/timeUtils";
import {JobExecutionEntity} from "@/modules/scheduling/entities/JobExecution.entity";
import {JobScheduleEntity} from "@/modules/scheduling/entities/JobScheduleEntity";
import {SCHEDULING_MODULE_DATA_SOURCE} from "@/modules/scheduling/infrastructure/database/constants";
import {type IJobScheduler} from "@/modules/scheduling/services/interfaces/IJobScheduler";

@Injectable()
export class JobScheduler implements IJobScheduler {
    private readonly logger = new Logger(JobScheduler.name);

    public constructor(
        @InjectRepository(JobExecutionEntity, SCHEDULING_MODULE_DATA_SOURCE)
        private readonly executionRepository: Repository<JobExecutionEntity>,
        @InjectRepository(JobScheduleEntity, SCHEDULING_MODULE_DATA_SOURCE)
        private readonly scheduleRepository: Repository<JobScheduleEntity>,
        @Inject(EventPublisherToken)
        private readonly publisher: IEventPublisher
    ) {}

    @Transactional({ connectionName: SCHEDULING_MODULE_DATA_SOURCE })
    @Interval(fromSeconds(5))
    public async schedulePending(): Promise<void> {
        this.logger.debug("Checking for pending jobs.");

        const jobs = await this.getPendingJobs();

        if (jobs.length <= 0) {
            this.logger.debug("No jobs to execute.");
            return;
        }

        const events = jobs.map(this.mapJobToEvent);

        await this.publisher.publishMany(events);
        await this.recordExecutions(jobs.map((job) => job.id));

        this.logger.log({ jobs }, "Jobs scheduled.");
    }

    private async recordExecutions(jobIds: string[]): Promise<void> {
        const repository = this.getExecutionRepository();
        const executedAt = new Date();
        const executions = jobIds.map((jobId) => ({ jobId, executedAt }));
        await repository.save(executions);
    }

    private async getPendingJobs(): Promise<JobScheduleEntity[]> {
        const repository = this.getScheduleRepository();

        return repository
            .createQueryBuilder("jobSchedule")
            .setLock("pessimistic_write")
            .setOnLocked("skip_locked")
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select("s.id")
                    .from(JobScheduleEntity, "s")
                    .leftJoin(JobExecutionEntity, "execution", "execution.jobId = s.id")
                    .groupBy("s.id")
                    .having("MAX(execution.executedAt) IS NULL")
                    .orHaving("MAX(execution.executedAt) + (s.interval * INTERVAL '1 millisecond') <= :now")
                    .getQuery();

                return "jobSchedule.id IN " + subQuery;
            })
            .setParameter("now", new Date())
            .getMany();
    }

    private mapJobToEvent(job: JobScheduleEntity) {
        return new JobTriggeredEvent({
            job: {
                id: job.id,
                callback: {
                    subject: job.callbackSubject,
                    topic: job.callbackTopic,
                },
            },
        });
    }

    private getExecutionRepository(): Repository<JobExecutionEntity> {
        return this.executionRepository;
    }

    private getScheduleRepository(): Repository<JobScheduleEntity> {
        return this.scheduleRepository;
    }
}
