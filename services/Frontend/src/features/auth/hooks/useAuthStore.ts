import { create } from "zustand";

import { Identity } from "@/features/auth/types/Identity";

type AuthState = {
    identity: Identity | null;
    accessToken: string | null;
    storeIdentity: (identity: Identity) => void;
    storeAccessToken: (token: string) => void;
    removeIdentity: () => void;
    removeAccessToken: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    identity: null,
    accessToken: null,
    storeIdentity: (identity) => set(() => ({ identity })),
    removeIdentity: () => set(() => ({ identity: null })),
    storeAccessToken: (accessToken) => set(() => ({ accessToken })),
    removeAccessToken: () => set(() => ({ accessToken: null })),
}));
