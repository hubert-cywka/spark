import { type Relation, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { JobScheduleEntity } from "@/modules/scheduling/entities/JobScheduleEntity";

@Entity("job_execution")
@Index("idx_job_execution_lookup", ["jobId", "executedAt"])
export class JobExecutionEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne((type) => JobScheduleEntity, (jobSchedule) => jobSchedule.executions, {
        onDelete: "CASCADE",
    })
    job!: Relation<JobScheduleEntity>;

    @Column({ type: "varchar" })
    jobId!: string;

    @Column({ type: "timestamptz", precision: 3 })
    executedAt!: Date;
}
