import { useBrowserStorage } from "@/hooks/useBrowserStorage";

const AUTH_TOKEN_STORAGE_KEY = "_jwt";

type UseAuthToken = {
    token: string | null;
    setToken: (token: string | null) => void;
};

export const useAuthToken = (): UseAuthToken => {
    const [token, setToken] = useBrowserStorage<string>(AUTH_TOKEN_STORAGE_KEY);
    return { token, setToken };
};
