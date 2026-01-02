import { ChildEntity, Column } from "typeorm";

import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

@ChildEntity("account_federated")
export class FederatedAccountEntity extends BaseAccountEntity {
    @Column({ type: "varchar" })
    providerId!: FederatedAccountProvider;
}
