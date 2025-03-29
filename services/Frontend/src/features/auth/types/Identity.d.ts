export type Identity = {
    id: string;
    email: string;
};

type Action = "read" | "write" | "delete";
type Resource = "daily" | "entry" | "goal" | "account" | "alert";

export type AccessScope = `${Action}:${Resource}` | "browse_as_authenticated" | "browse_as_unauthenticated";
