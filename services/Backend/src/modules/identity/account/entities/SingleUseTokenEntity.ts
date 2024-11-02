import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { AccountEntity } from "@/modules/identity/account/entities/AccountEntity";
import { SingleUseTokenType } from "@/modules/identity/account/types/SingleUseToken";

@Entity("single_use_token")
@Index(["value"])
export class SingleUseTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    value!: string;

    @Column({ type: "varchar" })
    type!: SingleUseTokenType;

    @Column({ type: "timestamp" })
    expiresAt!: Date;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    invalidatedAt!: Date | null;

    @Column({ type: "timestamp", nullable: true })
    usedAt!: Date | null;

    @ManyToOne((type) => AccountEntity, (user) => user.singleUseTokens)
    owner!: AccountEntity;
}
