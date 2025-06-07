import { Column, PrimaryColumn } from "typeorm";

export abstract class IntegrationEventPartitionEntity {
    @PrimaryColumn({ type: "int" })
    id!: number;

    @Column({ type: "timestamptz" })
    staleAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    lastProcessedAt!: Date | null;
}
