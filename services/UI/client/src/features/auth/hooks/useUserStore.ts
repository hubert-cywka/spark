import { create } from "zustand";

import { User } from "@/features/auth/types/user";

type UserState = {
    user: User | null;
    storeUser: (user: User) => unknown;
    removeUser: () => unknown;
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    storeUser: (user) => set(() => ({ user })),
    removeUser: () => set(() => ({ user: null })),
}));
