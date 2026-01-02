import { ChildEntity, Column } from "typeorm";

import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { ManagedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

@ChildEntity("account_managed")
export class ManagedAccountEntity extends BaseAccountEntity {
    @Column({ type: "varchar" })
    providerId!: ManagedAccountProvider;

    @Column({ type: "varchar" })
    password!: string;
}
