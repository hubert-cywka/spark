import { create } from "zustand";

import { AccessScope, Identity } from "@/features/auth/types/Identity";

type AuthState = {
    scopes: AccessScope[];
    identity: Identity | null;
    accessToken: string | null;
    storeIdentity: (identity: Identity) => void;
    storeAccessToken: (token: string) => void;
    removeIdentity: () => void;
    removeAccessToken: () => void;
};

// TODO: Scopes below are mocks, remove them later
export const useAuthStore = create<AuthState>((set) => ({
    scopes: ["browse_as_unauthenticated"],
    identity: null,
    accessToken: null,
    storeIdentity: (identity) => set(() => ({ identity, scopes: ["browse_as_authenticated"] })),
    removeIdentity: () => set(() => ({ identity: null, scopes: ["browse_as_unauthenticated"] })),
    storeAccessToken: (accessToken) => set(() => ({ accessToken })),
    removeAccessToken: () => set(() => ({ accessToken: null })),
}));
