const BASE_QUERY_KEY = "2fa";

export class TwoFactorAuthenticationQueryKeyFactory {
    public static createForAll() {
        return [BASE_QUERY_KEY];
    }
}
