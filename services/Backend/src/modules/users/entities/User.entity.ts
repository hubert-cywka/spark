import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("user")
export class UserEntity {
    @PrimaryColumn({ type: "varchar" })
    id!: string;

    @Column({ type: "varchar" })
    email!: string;

    @Column({ type: "boolean", default: false })
    isActivated!: boolean;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz", precision: 3 })
    updatedAt!: Date;
}
