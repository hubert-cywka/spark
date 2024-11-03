import { create } from "zustand";

import { AuthState } from "@/features/auth/hooks/session/types/AuthSession";

// TODO: Scopes below are mocks, remove them later
export const useAuthSession = create<AuthState>((set) => ({
    _type: "unauthenticated",
    scopes: ["browse_as_unauthenticated"],
    identity: null,
    accessToken: null,
    storeSession: ({ accessToken, identity }) => {
        return set(() => ({
            _type: "authenticated",
            scopes: ["browse_as_authenticated"],
            identity,
            accessToken,
        }));
    },
    endSession: () => {
        return set(() => ({
            _type: "unauthenticated",
            scopes: ["browse_as_unauthenticated"],
            identity: null,
            accessToken: null,
        }));
    },
}));
