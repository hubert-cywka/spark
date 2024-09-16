import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { RefreshTokenEntity } from "@/auth/entities/RefreshToken.entity";

@Entity("user")
@Index(["email"])
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar" })
    password!: string;

    @OneToMany((type) => RefreshTokenEntity, (token) => token.owner)
    refreshTokens!: RefreshTokenEntity[];
}
