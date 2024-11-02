export type Identity = {
    id: string;
    email: string;
    scopes?: AccessScope[];
};

export type AccessScope = "browse_as_authenticated" | "browse_as_unauthenticated";
