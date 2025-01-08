export type AuthenticationResponseDto = Readonly<{
    account: Readonly<{
        email: string;
        id: string;
    }>;
    accessToken: string;
}>;
