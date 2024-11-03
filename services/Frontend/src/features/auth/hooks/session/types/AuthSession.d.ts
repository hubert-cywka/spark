import { AccessScope, Identity } from "@/features/auth/types/Identity";

export type Session = {
    identity: Identity;
    accessToken: string;
};

export type AuthState = (AuthenticatedUserAuthState | UnauthenticatedUserAuthState) & BaseAuthState;

type BaseAuthState = {
    scopes: AccessScope[];
    storeSession: (session: Session) => void;
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
