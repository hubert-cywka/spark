import { TWO_FACTOR_AUTH_EVENTS } from "@/common/events/types/2fa/TWO_FACTOR_AUTH_EVENTS";
import { ACCOUNT_EVENTS } from "@/common/events/types/account/ACCOUNT_EVENTS";
import { ALERT_EVENTS } from "@/common/events/types/alert/ALERT_EVENTS";
import { SCHEDULING_EVENTS } from "@/common/events/types/scheduling/SCHEDULING_EVENTS";

export const IntegrationEvents = {
    account: ACCOUNT_EVENTS,
    alert: ALERT_EVENTS,
    twoFactorAuth: TWO_FACTOR_AUTH_EVENTS,
    scheduling: SCHEDULING_EVENTS,
};
