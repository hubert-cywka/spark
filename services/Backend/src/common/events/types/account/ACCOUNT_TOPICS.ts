export const ACCOUNT_TOPICS = {
    all: "account.*",
    suspended: "account.suspended",
    created: "account.created",

    activation: {
        completed: "account.activation_completed",
        requested: "account.activation_requested",
    },
    password: {
        resetRequested: "account.password_reset_requested",
        updated: "account.password_updated",
    },
    removal: {
        requested: "account.removal_requested",
        scheduled: "account.removal_scheduled",
        completed: "account.removal_completed",
    },
};
