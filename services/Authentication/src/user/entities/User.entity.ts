import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
@Index(["email"])
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;
}
