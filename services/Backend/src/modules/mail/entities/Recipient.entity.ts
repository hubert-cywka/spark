import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("recipient")
export class RecipientEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    email!: string;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;
}
