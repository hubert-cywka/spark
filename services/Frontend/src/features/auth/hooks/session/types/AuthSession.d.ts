import { AccessScope, Identity } from "@/features/auth/types/Identity";

export type AuthSession = {
    identity: Identity;
    accessToken: string;
    scopes: AccessScope[];
};

export type AuthState = (AuthenticatedUserAuthState | UnauthenticatedUserAuthState) & BaseAuthState;

type BaseAuthState = {
    scopes: AccessScope[];
    storeSession: (session: AuthSession) => void;
    endSession: () => void;
};

type AuthenticatedUserAuthState = {
    _type: "authenticated";
    identity: Identity;
    accessToken: string;
};

type UnauthenticatedUserAuthState = {
    _type: "unauthenticated";
    identity: null;
    accessToken: null;
};
