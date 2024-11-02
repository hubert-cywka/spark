import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { AccountEntity } from "@/modules/identity/account/entities/AccountEntity";

@Entity("refresh_token")
@Index(["hashedValue"])
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    hashedValue!: string;

    @Column({ type: "timestamp" })
    expiresAt!: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    invalidatedAt!: Date | null;

    @ManyToOne((type) => AccountEntity, (user) => user.refreshTokens)
    owner!: AccountEntity;
}
