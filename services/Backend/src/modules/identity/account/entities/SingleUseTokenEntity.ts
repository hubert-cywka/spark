import { type Relation, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import type { SingleUseTokenType } from "@/modules/identity/account/types/SingleUseToken";

@Entity("single_use_token")
@Index("idx_token_value_type_unique", ["value", "type"], { unique: true })
@Index("idx_token_invalidation", ["ownerId", "type"], { where: '"invalidatedAt" IS NULL' })
@Index("idx_token_expiry", ["expiresAt"])
export class SingleUseTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    value!: string;

    @Column({ type: "varchar" })
    type!: SingleUseTokenType;

    @Column({ type: "timestamptz", precision: 3 })
    expiresAt!: Date;

    @CreateDateColumn({ type: "timestamptz", precision: 3 })
    createdAt!: Date;

    @Column({ type: "timestamptz", precision: 3, nullable: true })
    invalidatedAt!: Date | null;

    @Column({ type: "timestamptz", precision: 3, nullable: true })
    usedAt!: Date | null;

    @ManyToOne((type) => BaseAccountEntity, (account) => account.singleUseTokens, {
        onDelete: "CASCADE",
    })
    owner!: Relation<BaseAccountEntity>;

    @Column({ type: "uuid" })
    ownerId!: string;
}
