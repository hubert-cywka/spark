export const AppConfig = () => ({
    appName: process.env.APP_NAME,
    port: parseInt(process.env.PORT ?? ""),

    throttle: {
        ttl: process.env.RATE_LIMITING_BASE_TTL,
        limit: process.env.RATE_LIMITING_BASE_LIMIT,
    },

    client: {
        url: {
            base: process.env.CLIENT_URL_BASE,
        },
    },

    cookies: {
        secret: process.env.COOKIES_SECRET,
    },

    events: {
        encryption: {
            secret: process.env.EVENTS_ENCRYPTION_SECRET,
        },
    },

    pubsub: {
        host: process.env.PUBSUB_HOST,
        port: parseInt(process.env.PUBSUB_PORT ?? ""),
    },

    modules: {
        gdpr: {
            database: {
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.GDPR_DATABASE_NAME,
            },
        },

        alerts: {
            database: {
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.ALERTS_DATABASE_NAME,
            },
        },

        mail: {
            isDebugMode: process.env.MAIL_DEBUG_MODE === "true",
            sender: {
                name: process.env.MAIL_SENDER_NAME,
                user: process.env.MAIL_SENDER_USER,
                port: process.env.MAIL_SENDER_PORT,
                password: process.env.MAIL_SENDER_PASSWORD,
                host: process.env.MAIL_SENDER_HOST,
            },
            database: {
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.MAIL_DATABASE_NAME,
            },
        },

        users: {
            database: {
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.USERS_DATABASE_NAME,
            },
        },

        journal: {
            database: {
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.JOURNAL_DATABASE_NAME,
            },
        },

        identity: {
            jwt: {
                signingSecret: process.env.JWT_SIGNING_SECRET,
                expirationTimeInSeconds: parseInt(process.env.JWT_EXPIRATION_TIME_IN_SECONDS ?? ""),
            },
            refreshToken: {
                signingSecret: process.env.REFRESH_TOKEN_SIGNING_SECRET,
                expirationTimeInSeconds: parseInt(process.env.REFRESH_TOKEN_EXPIRATION_TIME_IN_SECONDS ?? ""),
            },
            database: {
                port: process.env.DATABASE_PORT,
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                host: process.env.DATABASE_HOST,
                name: process.env.AUTH_DATABASE_NAME,
            },
            throttle: {
                ttl: parseInt(process.env.AUTH_THROTTLE_TTL_IN_MS ?? ""),
                limit: parseInt(process.env.AUTH_THROTTLE_LIMIT ?? ""),
            },
            oidc: {
                cookie: {
                    expirationTimeInSeconds: parseInt(process.env.OIDC_COOKIE_EXPIRATION_TIME_IN_SECONDS ?? ""),
                },
                google: {
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    redirectUrl: process.env.GOOGLE_OIDC_REDIRECT_URL,
                },
            },
        },
    },
});
