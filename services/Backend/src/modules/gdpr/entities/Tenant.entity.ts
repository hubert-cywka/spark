import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tenant")
export class TenantEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
}
