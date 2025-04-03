import { type Relation, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { TwoFactorAuthenticationMethod } from "@/modules/identity/2fa/types/TwoFactorAuthenticationMethod";
import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";

const DEFAULT_CODE_TTL = 30;

@Entity("two_factor_authentication_integration")
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
}
