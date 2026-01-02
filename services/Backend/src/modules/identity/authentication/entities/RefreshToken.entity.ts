import { type Relation, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";

@Entity("refresh_token")
@Index("idx_refresh_token_hash", ["hashedValue"])
@Index("idx_refresh_token_owner_active", ["ownerId"], { where: '"invalidatedAt" IS NULL' })
@Index("idx_refresh_token_expiry", ["expiresAt"])
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    hashedValue!: string;

    @Column({ type: "timestamptz" })
    expiresAt!: Date;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    invalidatedAt!: Date | null;

    @ManyToOne((type) => BaseAccountEntity, (user) => user.refreshTokens, {
        onDelete: "CASCADE",
    })
    owner!: Relation<BaseAccountEntity>;

    @Column({ type: "uuid" })
    ownerId!: string;
}
