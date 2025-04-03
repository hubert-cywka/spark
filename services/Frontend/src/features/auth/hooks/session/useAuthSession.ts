import { create } from "zustand";

import { AuthState } from "@/features/auth/hooks/session/types/AuthSession";

export const useAuthSession = create<AuthState>((set) => ({
    _type: "unauthenticated",
    scopes: {
        active: ["browse_as_unauthenticated"],
        inactive: [],
    },
    identity: null,
    accessToken: null,

    storeSession: ({ accessToken, identity, scopes }) => {
        return set(() => ({
            _type: "authenticated",
            scopes: {
                active: [...scopes.active, "browse_as_authenticated"],
                inactive: scopes.inactive,
            },
            identity,
            accessToken,
        }));
    },

    endSession: () => {
        return set(() => ({
            _type: "unauthenticated",
            scopes: {
                active: ["browse_as_unauthenticated"],
                inactive: [],
            },
            identity: null,
            accessToken: null,
        }));
    },
}));
