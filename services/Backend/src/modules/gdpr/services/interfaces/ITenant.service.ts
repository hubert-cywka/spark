import { type Tenant } from "@/modules/gdpr/models/Tenant.model";

export const TenantServiceToken = Symbol("TenantServiceToken");

export interface ITenantService {
    create(id: string): Promise<Tenant>;
}
