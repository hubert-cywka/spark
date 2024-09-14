export default () => ({
    port: parseInt(process.env.PORT ?? ""),
    jwt: {
        signingSecret: process.env.JWT_SIGNING_SECRET,
        expirationTimeInSeconds: parseInt(process.env.JWT_EXPIRATION_TIME_IN_SECONDS ?? ""),
    },
});
