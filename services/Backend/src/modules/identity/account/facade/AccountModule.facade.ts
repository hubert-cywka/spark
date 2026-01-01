import { Inject } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

import { IAccountModuleFacade } from "@/modules/identity/account/facade/IAccountModule.facade";
import { Account } from "@/modules/identity/account/models/Account.model";
import {
    type IFederatedAccountService,
    FederatedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IFederatedAccountService";
import {
    type IManagedAccountService,
    ManagedAccountServiceToken,
} from "@/modules/identity/account/services/interfaces/IManagedAccountService";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";
import { IDENTITY_MODULE_DATA_SOURCE } from "@/modules/identity/infrastructure/database/constants";

export class AccountModuleFacade implements IAccountModuleFacade {
    constructor(
        @Inject(ManagedAccountServiceToken)
        private readonly managedAccountService: IManagedAccountService,
        @Inject(FederatedAccountServiceToken)
        private readonly federatedAccountService: IFederatedAccountService
    ) {}

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async createFederatedAccount(providerAccountId: string, providerId: FederatedAccountProvider, email: string): Promise<Account> {
        const account = await this.federatedAccountService.createAccountWithExternalIdentity(providerAccountId, providerId, email);
        await this.federatedAccountService.activateByInternalId(account.id);
        return account;
    }

    @Transactional({ connectionName: IDENTITY_MODULE_DATA_SOURCE })
    public async createManagedAccount(email: string, password: string, clientRedirectUrl: string): Promise<Account> {
        const account = await this.managedAccountService.createAccountWithCredentials(email, password);
        await this.managedAccountService.requestActivation(email, clientRedirectUrl);
        return account;
    }

    public async getFederatedAccount(providerAccountId: string, providerId: FederatedAccountProvider) {
        return await this.federatedAccountService.getByExternalIdentity(providerAccountId, providerId);
    }

    public async getManagedAccount(email: string, password: string) {
        return await this.managedAccountService.getActivatedByCredentials(email, password);
    }
}
