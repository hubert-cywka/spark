export const AppConfig = () => ({
    appUrl: process.env.APP_URL,
    port: parseInt(process.env.PORT ?? ""),

    pubsub: {
        host: process.env.PUBSUB_HOST,
        port: parseInt(process.env.PUBSUB_PORT ?? ""),
    },

    modules: {
        mail: {
            isDebugMode: process.env.MAIL_DEBUG_MODE === "true",
            sender: {
                name: process.env.MAIL_SENDER_NAME,
                user: process.env.MAIL_SENDER_USER,
                port: process.env.MAIL_SENDER_PORT,
                password: process.env.MAIL_SENDER_PASSWORD,
                host: process.env.MAIL_SENDER_HOST,
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

        auth: {
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
        },
    },
});
