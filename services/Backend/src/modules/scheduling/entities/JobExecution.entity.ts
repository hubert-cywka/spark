import { type Relation, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { JobScheduleEntity } from "@/modules/scheduling/entities/JobScheduleEntity";

@Entity("job_execution")
export class JobExecutionEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne((type) => JobScheduleEntity, (jobSchedule) => jobSchedule.executions, {
        onDelete: "CASCADE",
    })
    job!: Relation<JobScheduleEntity>;

    @Column({ type: "varchar" })
    jobId!: string;

    @Column({ type: "timestamptz" })
    executedAt!: Date;
}
