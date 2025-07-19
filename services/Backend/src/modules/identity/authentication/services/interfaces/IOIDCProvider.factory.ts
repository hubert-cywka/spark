import { type IOIDCProvider } from "@/modules/identity/authentication/services/interfaces/IOIDCProvider.service";
import { FederatedAccountProvider } from "@/modules/identity/authentication/types/ManagedAccountProvider";

export const OIDCProviderFactoryToken = Symbol("IOIDCProviderFactory");

export interface IOIDCProviderFactory {
    create: (providerId: FederatedAccountProvider) => IOIDCProvider;
}
