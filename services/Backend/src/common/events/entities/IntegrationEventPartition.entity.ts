import { Column, PrimaryColumn } from "typeorm";

export abstract class IntegrationEventPartitionEntity {
    @PrimaryColumn({ type: "int" })
    id!: number;

    @Column({ type: "timestamptz", precision: 3 })
    staleAt!: Date;

    @Column({ type: "timestamptz", precision: 3, nullable: true })
    lastProcessedAt!: Date | null;
}
