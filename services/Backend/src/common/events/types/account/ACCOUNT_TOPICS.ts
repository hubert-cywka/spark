export const ACCOUNT_TOPICS = {
    all: "account.*",
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
};
