import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("recipient")
export class RecipientEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    email!: string;
}
