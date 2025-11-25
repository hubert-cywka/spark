import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, Relation, UpdateDateColumn } from "typeorm";

import { JobExecutionEntity } from "@/modules/scheduling/entities/JobExecution.entity";

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
    callbackTopic!: string;

    @Column("varchar")
    callbackSubject!: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;
}
