import { type Relation, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import type { SingleUseTokenType } from "@/modules/identity/account/types/SingleUseToken";

@Entity("single_use_token")
@Index(["value"])
export class SingleUseTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    value!: string;

    @Column({ type: "varchar" })
    type!: SingleUseTokenType;

    @Column({ type: "timestamptz" })
    expiresAt!: Date;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    invalidatedAt!: Date | null;

    @Column({ type: "timestamptz", nullable: true })
    usedAt!: Date | null;

    @ManyToOne((type) => BaseAccountEntity, (account) => account.singleUseTokens)
    owner!: Relation<BaseAccountEntity>;
}
