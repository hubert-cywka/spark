import {
    type Relation,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    TableInheritance,
    UpdateDateColumn,
} from "typeorm";

import { SingleUseTokenEntity } from "@/modules/identity/account/entities/SingleUseTokenEntity";
import { RefreshTokenEntity } from "@/modules/identity/authentication/entities/RefreshToken.entity";

// Hubert: Using Single Table Inheritance over Concrete Table Inheritance or composition as I need to use One-to-Many
// relationships which wouldn't work without any workarounds. This approach is simpler and still good enough as there
// are very few differences between different account types.
@Entity("account")
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class BaseAccountEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    providerAccountId!: string;

    @Column({ type: "varchar" })
    email!: string;

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
}
