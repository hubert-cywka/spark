import { useEffect } from "react";
import { AxiosInstance } from "axios";

import { useAuthSession } from "@/features/auth/hooks";

export const useAuthHeaderInterceptor = (client: AxiosInstance) => {
    const accessToken = useAuthSession((state) => state.accessToken);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const interceptor = client.interceptors.request.use((req) => {
            req.headers.set("Authorization", `Bearer ${accessToken}`);
            return req;
        });

        return () => {
            client.interceptors.request.eject(interceptor);
        };
    }, [accessToken, client]);
};
