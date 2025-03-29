import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { AuthSession } from "@/features/auth/hooks/session/types/AuthSession";

const ACCESS_TOKEN_QUERY_PARAM_NAME = "accessToken";
const ACCOUNT_QUERY_PARAM_NAME = "account";
const ACCESS_SCOPES_QUERY_PARAM_NAME = "accessScopes";

export const useGetAuthSessionFromQueryParams = () => {
    const searchParams = useSearchParams();
    const encodedScopes = useMemo(() => searchParams.get(ACCESS_SCOPES_QUERY_PARAM_NAME), [searchParams]);
    const accessToken = useMemo(() => searchParams.get(ACCESS_TOKEN_QUERY_PARAM_NAME), [searchParams]);
    const encodedAccount = useMemo(() => searchParams.get(ACCOUNT_QUERY_PARAM_NAME), [searchParams]);

    return useMemo((): AuthSession | null => {
        if (!accessToken || !encodedAccount || !encodedScopes) {
            return null;
        }

        const identity = JSON.parse(decodeURIComponent(encodedAccount));
        const scopes = JSON.parse(decodeURIComponent(encodedScopes));

        return { accessToken, identity, scopes };
    }, [encodedScopes, accessToken, encodedAccount]);
};
