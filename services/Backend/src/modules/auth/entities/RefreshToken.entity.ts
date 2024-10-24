import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { UserEntity } from "@/modules/auth/entities/User.entity";

@Entity("refresh_token")
@Index(["value"])
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    value!: string;

    @Column({ type: "timestamp" })
    expiresAt!: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    invalidatedAt!: Date | null;

    @ManyToOne((type) => UserEntity, (user) => user.refreshTokens)
    owner!: UserEntity;
}
