import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";

@Entity("account")
@Index(["email"])
export class AccountEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar" })
    password!: string;

    @Column({ type: "timestamp", nullable: true })
    activatedAt!: Date | null;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @OneToMany((type) => RefreshTokenEntity, (token) => token.owner)
    refreshTokens!: RefreshTokenEntity[];

    @OneToMany((type) => SingleUseTokenEntity, (token) => token.owner)
    singleUseTokens!: SingleUseTokenEntity[];
}
