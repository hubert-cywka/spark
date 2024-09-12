export default () => ({
    port: parseInt(process.env.PORT),
    jwt: {
        signingSecret: process.env.JWT_SIGNING_SECRET,
        expirationTimeInSeconds: parseInt(process.env.JWT_LIFETIME_SECONDS),
    },
});
