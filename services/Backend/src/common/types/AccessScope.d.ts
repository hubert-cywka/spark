type Action = "read" | "write" | "delete";
type Resource = "daily" | "entry" | "goal" | "account" | "alert" | "2fa";

export type AccessScope = `${Action}:${Resource}`;

export type AccessScopes = {
    active: AccessScope[];
    inactive: AccessScope[];
};
