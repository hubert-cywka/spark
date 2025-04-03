import { AccessScope } from "@/features/auth/types/Identity";

export type AuthenticationResponseDto = Readonly<{
    account: Readonly<{
        email: string;
        id: string;
    }>;
    accessScopes: AccessScopesDto;
    accessToken: string;
}>;

type AccessScopesDto = {
    inactive: AccessScope[];
    active: AccessScope[];
};
