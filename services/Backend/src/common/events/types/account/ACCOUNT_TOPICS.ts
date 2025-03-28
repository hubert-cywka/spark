export const ACCOUNT_TOPICS = {
    all: "account.*",
    suspended: "account.suspended",
    activation: {
        completed: "account.activation_completed",
        requested: "account.activation_requested",
    },
    registration: {
        completed: "account.registration_completed",
    },
    password: {
        resetRequested: "account.password_reset_requested",
        updated: "account.password_updated",
    },
    removal: {
        requested: "account.removal_requested",
        completed: "account.removal_completed",
    },
};
