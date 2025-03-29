type Action = "read" | "write" | "delete";
type Resource = "daily" | "entry" | "goal" | "account" | "alert";

export type AccessScope = `${Action}:${Resource}`;
