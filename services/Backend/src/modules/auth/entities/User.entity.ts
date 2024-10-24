import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { RefreshTokenEntity } from "@/modules/auth/entities/RefreshToken.entity";

@Entity("user")
@Index(["email"])
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar" })
    password!: string;

    @Column({ type: "varchar", nullable: true })
    passwordResetToken!: string | null;

    @Column({ type: "varchar", nullable: true })
    activationToken!: string | null;

    @Column({ type: "timestamp", nullable: true })
    activatedAt!: Date | null;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @OneToMany((type) => RefreshTokenEntity, (token) => token.owner)
    refreshTokens!: RefreshTokenEntity[];
}
