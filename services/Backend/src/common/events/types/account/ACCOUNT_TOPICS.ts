export const ACCOUNT_TOPICS = {
    all: "account.*",
    suspended: "account.suspended",
    created: "account.created",

    activation: {
        completed: "account.activation.completed",
        requested: "account.activation.requested",
    },
    password: {
        resetRequested: "account.password_reset.requested",
        updated: "account.password.updated",
    },
    removal: {
        requested: "account.removal.requested",
        scheduled: "account.removal.scheduled",
        completed: "account.removal.completed",
    },
};
