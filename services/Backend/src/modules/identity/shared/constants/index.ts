import { fromSeconds } from "@/common/utils/timeUtils";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 1024;

export const IDENTITY_MODULE_STRICT_RATE_LIMITING = {
    default: { limit: 5, ttl: fromSeconds(30) },
};
export const IDENTITY_MODULE_DEFAULT_RATE_LIMITING = {
    default: { limit: 30, ttl: fromSeconds(60) },
};
