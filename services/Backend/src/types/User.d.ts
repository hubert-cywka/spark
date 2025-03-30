import { AccessScopes } from "@/common/types/AccessScope";

export type User = {
    id: string;
    email: string;
    providerId: string;
    providerAccountId: string;
    accessScopes: AccessScopes;
};
