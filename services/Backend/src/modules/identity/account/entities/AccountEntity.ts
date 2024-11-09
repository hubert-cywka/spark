import { type Relation, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";
import { AccountProvider } from "@/modules/identity/authentication/types/AccountProvider";

@Entity("account")
@Index(["providerId", "providerAccountId"])
export class AccountEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    providerId!: AccountProvider;

    @Column({ type: "varchar" })
    providerAccountId!: string;

    @Column({ type: "varchar" })
    email!: string;

    @Column({ type: "varchar", nullable: true })
    password!: string | null;

    @Column({ type: "timestamp", nullable: true })
    activatedAt!: Date | null;

    @Column({ type: "timestamp", nullable: true })
    termsAndConditionsAcceptedAt!: Date | null;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @OneToMany((type) => RefreshTokenEntity, (token) => token.owner)
    refreshTokens!: Relation<RefreshTokenEntity>[];

    @OneToMany((type) => SingleUseTokenEntity, (token) => token.owner)
    singleUseTokens!: Relation<SingleUseTokenEntity>[];

    public assertManagedAccountInvariants(): this is ManagedAccountEntity {
        const isEmailCorrect = !!this.email;
        const isPasswordCorrect = !!this.password;
        const isProviderAccountIdCorrect = this.providerAccountId === this.email;
        return isEmailCorrect && isPasswordCorrect && isProviderAccountIdCorrect;
    }

    public assertFederatedAccountInvariants(): this is FederatedAccountEntity {
        const allowedProviders: AccountProvider[] = [AccountProvider.GOOGLE];
        const isProviderIdCorrect = allowedProviders.some((provider) => provider === this.providerId);
        const isProviderAccountIdCorrect = !!this.providerAccountId;
        const isPasswordEmpty = !this.password;
        return isPasswordEmpty && isProviderIdCorrect && isProviderAccountIdCorrect;
    }
}

class ManagedAccountEntity extends AccountEntity {
    declare providerId: AccountProvider.CREDENTIALS;
    declare password: string;
}

class FederatedAccountEntity extends AccountEntity {
    declare providerId: AccountProvider.GOOGLE;
    declare password: null;
}
