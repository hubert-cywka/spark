import { fromSeconds } from "@/common/utils/timeUtils";

export const DEFAULT_RATE_LIMITING = { default: { name: "default", limit: 180, ttl: fromSeconds(60) } };

export const STRICT_RATE_LIMITING = { strict: { name: "strict", limit: 60, ttl: fromSeconds(60) } };

export const AUTH_DEFAULT_RATE_LIMITING = { auth_default: { name: "auth_default", limit: 60, ttl: fromSeconds(60) } };

export const AUTH_STRICT_RATE_LIMITING = { auth_strict: { name: "auth_strict", limit: 30, ttl: fromSeconds(60) } };
