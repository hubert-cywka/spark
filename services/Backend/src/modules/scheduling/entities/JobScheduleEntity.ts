import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, Relation, UpdateDateColumn } from "typeorm";

import { type IntegrationEventSubject, type IntegrationEventTopic } from "@/common/events/types";
import { JobExecutionEntity } from "@/modules/scheduling/entities/JobExecution.entity";

// TODO: Add a job that will remove old executions
@Entity("job_schedule")
export class JobScheduleEntity {
    @PrimaryColumn("varchar")
    id!: string;

    @OneToMany((type) => JobExecutionEntity, (execution) => execution.job, {
        cascade: ["remove"],
    })
    executions!: Relation<JobExecutionEntity>[];

    @Column({ type: "int" })
    interval!: number;

    @Column("varchar")
    callbackTopic!: IntegrationEventTopic;

    @Column("varchar")
    callbackSubject!: IntegrationEventSubject;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;
}
