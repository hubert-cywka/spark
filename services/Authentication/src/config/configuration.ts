export default () => ({
    port: parseInt(process.env.PORT ?? ""),
    jwt: {
        signingSecret: process.env.JWT_SIGNING_SECRET,
        expirationTimeInSeconds: parseInt(process.env.JWT_EXPIRATION_TIME_IN_SECONDS ?? ""),
    },
    database: {
        port: parseInt(process.env.DATABASE_PORT ?? ""),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        name: process.env.DATABASE_NAME,
    },
});
