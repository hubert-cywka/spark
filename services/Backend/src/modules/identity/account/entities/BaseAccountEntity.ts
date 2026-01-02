import {
    type Relation,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    TableInheritance,
    UpdateDateColumn,
} from "typeorm";

import { TwoFactorAuthenticationIntegrationEntity } from "@/modules/identity/2fa/entities/TwoFactorAuthenticationIntegration.entity";
import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";

// Hubert: Using Single Table Inheritance over Concrete Table Inheritance or composition as I need to use One-to-Many
// relationships which wouldn't work without any workarounds. This approach is simpler and still good enough as there
// are very few differences between different account types.
@Entity("account")
@TableInheritance({ column: { type: "varchar", name: "type" } })
@Index("idx_account_email", ["email"])
@Index("idx_account_provider_identity", ["providerId", "providerAccountId"], { unique: true })
@Index("idx_account_status", ["id"], { where: '"suspendedAt" IS NULL' })
export class BaseAccountEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    providerAccountId!: string;

    @Column({ type: "varchar" })
    email!: string;

    @Column({ type: "timestamptz", nullable: true })
    activatedAt!: Date | null;

    @Column({ type: "timestamptz", nullable: true })
    termsAndConditionsAcceptedAt!: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    suspendedAt!: Date | null;

    @OneToMany((type) => RefreshTokenEntity, (token) => token.owner)
    refreshTokens!: Relation<RefreshTokenEntity>[];

    @OneToMany((type) => SingleUseTokenEntity, (token) => token.owner)
    singleUseTokens!: Relation<SingleUseTokenEntity>[];

    @OneToMany((type) => TwoFactorAuthenticationIntegrationEntity, (option) => option.owner)
    twoFactorAuthOptions!: Relation<TwoFactorAuthenticationIntegrationEntity>[];
}
