import { Column } from "typeorm";

export class IntegrationEventPartitionEntity {
    @Column({ type: "timestamptz", nullable: true })
    lastProcessedAt!: Date | null;
}
