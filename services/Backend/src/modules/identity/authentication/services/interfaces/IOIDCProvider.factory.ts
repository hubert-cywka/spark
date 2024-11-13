import { type IOIDCProviderService } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.service";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export const IOIDCProviderFactoryToken = Symbol("IOIDCProviderFactory");

export interface IOIDCProviderFactory {
    create: (providerId: FederatedAccountProvider) => IOIDCProviderService;
}
