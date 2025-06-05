import { Column, PrimaryColumn } from "typeorm";

export class IntegrationEventPartitionEntity {
    @PrimaryColumn({ type: "int" })
    id!: number;

    @Column({ type: "timestamptz", nullable: true })
    lastProcessedAt!: Date | null;
}
