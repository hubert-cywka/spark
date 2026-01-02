import { type Relation, Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";

const DEFAULT_CODE_TTL = 30;

@Entity("two_factor_authentication_integration")
@Index("idx_2fa_user_method", ["ownerId", "method"])
@Index("idx_2fa_active_methods", ["ownerId"], { where: '"enabledAt" IS NOT NULL' })
export class TwoFactorAuthenticationIntegrationEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    method!: TwoFactorAuthenticationMethod;

    @Column({ type: "varchar" })
    secret!: string;

    @Column({ type: "int", default: DEFAULT_CODE_TTL })
    totpTTL!: number;

    @Column({ type: "timestamptz", nullable: true })
    enabledAt!: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @ManyToOne((type) => BaseAccountEntity, (user) => user.twoFactorAuthOptions, {
        onDelete: "CASCADE",
    })
    owner!: Relation<BaseAccountEntity>;

    @Column({ type: "varchar" })
    ownerId!: string;
}
