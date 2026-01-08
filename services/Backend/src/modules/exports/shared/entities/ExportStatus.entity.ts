import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("export_status")
@Index("idx_export_status", ["exportId", "domain"], { unique: true })
export class ExportStatusEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    exportId!: string;

    @Column({ type: "varchar" })
    domain!: string;

    @Column({ type: "timestamptz", precision: 3, nullable: true })
    exportedUntil!: Date | null;

    @Column({ type: "varchar", nullable: true })
    nextCursor!: string | null;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;
}
