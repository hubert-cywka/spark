import { type Relation, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { TwoFactorAuthenticationMethod } from "@/modules/identity/authentication/types/TwoFactorAuthenticationMethod";

@Entity("two_factor_authentication_option")
export class TwoFactorAuthenticationOptionEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    method!: TwoFactorAuthenticationMethod;

    @Column({ type: "varchar" })
    secret!: string;

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
