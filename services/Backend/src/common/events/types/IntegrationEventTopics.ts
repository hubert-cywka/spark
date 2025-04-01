import { ACCOUNT_TOPICS } from "./account/ACCOUNT_TOPICS";

import { TWO_FACTOR_AUTH_TOPICS } from "@/common/events/types/2fa/TWO_FACTOR_AUTH_TOPICS";
import { ALERT_TOPICS } from "@/common/events/types/alert/ALERT_TOPICS";

export const IntegrationEventTopics = {
    account: ACCOUNT_TOPICS,
    alert: ALERT_TOPICS,
    twoFactorAuth: TWO_FACTOR_AUTH_TOPICS,
};
