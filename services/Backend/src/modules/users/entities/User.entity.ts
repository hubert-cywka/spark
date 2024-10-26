import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryColumn({ type: "varchar" })
    id!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar" })
    lastName!: string;

    @Column({ type: "varchar" })
    firstName!: string;

    @Column({ type: "boolean", default: false })
    isActivated!: boolean;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;
}
