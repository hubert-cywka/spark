import { ChildEntity, Column, Index } from "typeorm";

import { BaseAccountEntity } from "@/modules/identity/account/entities/BaseAccountEntity";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

@ChildEntity("account_federated")
@Index(["providerId", "providerAccountId"])
export class FederatedAccountEntity extends BaseAccountEntity {
    @Column({ type: "enum", enum: FederatedAccountProvider })
    providerId!: FederatedAccountProvider;
}
