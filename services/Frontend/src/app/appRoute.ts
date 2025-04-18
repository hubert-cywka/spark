export enum AppRoute {
    HOME = "/",

    INSIGHTS = "/insights",
    DAILY = "/daily",
    GOALS = "/goals",
    GOAL = "/goals/:id",

    SETTINGS = "/settings",
    ALERTS = "/settings/alerts",
    PROFILE = "/settings/profile",

    LOGIN = "/authentication/login",
    REGISTER = "/authentication/register",
    RESET_PASSWORD = "/authentication/reset-password",
    ACTIVATE_ACCOUNT = "/authentication/activate-account",

    OIDC_LOGIN = "/authentication/open-id-connect/login",
    OIDC_REGISTER = "/authentication/open-id-connect/register",
}
