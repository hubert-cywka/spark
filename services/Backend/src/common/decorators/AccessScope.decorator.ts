import { SetMetadata } from "@nestjs/common";

import { AccessScope } from "@/common/types/AccessScope";

export const ACCESS_SCOPES_METADATA = "access_scopes";

export const AccessScopes = (...accessScopes: AccessScope[]) => SetMetadata(ACCESS_SCOPES_METADATA, accessScopes);
