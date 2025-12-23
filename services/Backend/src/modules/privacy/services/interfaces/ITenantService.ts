import { type Tenant } from "@/modules/privacy/models/Tenant.model";

export const TenantServiceToken = Symbol("TenantServiceToken");

export interface ITenantService {
    create(id: string): Promise<Tenant>;
    remove(id: string): Promise<void>;
}
