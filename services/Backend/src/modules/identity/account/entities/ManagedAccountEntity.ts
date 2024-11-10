import { ChildEntity, Column, Index } from "typeorm";

import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { ManagedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

@ChildEntity("account_managed")
@Index(["providerId", "providerAccountId"])
export class ManagedAccountEntity extends BaseAccountEntity {
    @Column({ type: "enum", enum: ManagedAccountProvider })
    providerId!: ManagedAccountProvider;

    @Column({ type: "varchar" })
    password!: string;
}
